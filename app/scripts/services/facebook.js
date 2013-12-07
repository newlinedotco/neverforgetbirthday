angular.module('alFacebook', [])
// FBService
// ---------------------
// 
// The FBService is responsible for loading 
// the Facebook JavaScript SDK
// and that's all
// It serves the FB window object in the form
// of a promise.
// 
// We can get access to the FB object through this
// service by:
// 
//  FBService.then(function(FB) {
//    FB.api(//...
//  })
.provider('FBService', function() {
  var _scriptUrl = '//connect.facebook.net/en_US/all.js'
  , _scriptId = 'facebook-jssdk'
  , _fbConfig = null;

  this.init = function(config) {
    _fbConfig = config || _fbConfig;
    return this;
  }

  // Create a script tag with moment as the source
  // and call our onScriptLoad callback when it
  // has been loaded
  function createScript($document, callback, success) {
    var scriptTag = $document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.id = _scriptId;
    scriptTag.src = _scriptUrl;
    scriptTag.onreadystatechange = function () {
      if (this.readyState == 'complete') {
        callback();
      }
    }
    // Set the callback to be run
    // after the scriptTag has loaded
    scriptTag.onload = callback;
    // Attach the script tag to the document body
    var s = $document.getElementsByTagName('body')[0];
        s.appendChild(scriptTag);
  }

  // Create the FBService method
  // injecting the `$document`, `$timeout`, 
  // `$q`, `$rootScope`, and `$window` services
  this.$get = function($document, $timeout, $q, $rootScope, $window) {
    var  deferred = $q.defer(),
      _FB = $window.FB,
      self = this;

    // Create a `fbAsyncInit` method that gets
    // called by the Facebook SDK after it is loaded
    function onSuccess() {
     $window.fbAsyncInit = function() {
       // Executed when the SDK is loaded
       FB.init(_fbConfig);
     };
    }

     // Load client in the browser
     // which will get called after the script
     // tag has been loaded
    var onScriptLoad = function(callback) {
      onSuccess();
      $timeout(function() {
        // Resolve the deferred promise
        // as the FB object on the window
        deferred.resolve($window.FB);
      });
    };

    // Kick it off and get Facebooking
    createScript($document[0], onScriptLoad);
    return deferred.promise;
   }
})
// The FB Service
// -----------------
// 
// This service wraps the FB object in more helpful
// methods that are more angular-friendly with promises
// 
// It attaches to the `auth.authResponseChange` event
// fired by the FB object on instantiation, so
// we'll be able to detect if the user is logged in
// or not immediately.
.provider('FB', function() {
  // Define the service
  this.$get = function($rootScope, $q, FBService) {
    // We'll create a `loginDefer` object that
    // will enable us to depend upon the user
    // being logged in when this resolves.
    // Anytime that we have a method that needs
    // to have a valid user, we'll wait for the promise
    // to resolve
    var loginDefer = $q.defer(),
        loginPromise = loginDefer.promise;

    // On init, we'll attach to the 
    // `auth.authResponseChange` event
    // If the auth status comes back with a status
    // of `connected`, then we'll resolve the
    // login defer object immediately
    FBService.then(function(fb) {
      fb.Event.subscribe('auth.authResponseChange', 
        function(res) {
          if (res.status === 'connected') {
            loginDefer.resolve(res);
          }
        })
    });

    // Define the service object
    var service = {
      login: function(scope) {
        loginDefer = $q.defer();
        loginPromise = loginDefer.promise;

        FBService.then(function(fb) {
          fb.Event.subscribe('auth.authResponseChange', 
            function(res) {
              if(res.status === 'connected') {
                localStorage.setItem('auth', JSON.stringify(res));
                $rootScope.$broadcast('user:login');
                loginDefer.resolve(res);
              } else if (res.status === 'not_authorized') {
                loginDefer.reject(res);
              } else {
                loginDefer.reject(res);
              }
            });
          fb.login(function(resp) {}, {scope:scope});
        });

        return loginPromise;
      },
      logout: function() {
        var d = $q.defer();
        FBService.then(function(fb) {
          fb.logout(function(resp) {
            $rootScope.$broadcast('user:logout');
            d.resolve(resp);
          });
        });

        return d.promise;
      },
      loggedIn: function() {
        var d = $q.defer();
        FBService.then(function(fb) {
          if (fb.getUserID()) {
            d.resolve(true);
          } else {
            d.reject(false);
          }
        });
        return d.promise;
      },
      getProfile: function(conf) {
        var d = $q.defer();
        FBService.then(function(fb) {
          loginPromise.then(function() {
            fb.api('/me', conf || {}, function(resp) {
              d.resolve(resp);
            });
          });
        });
        return d.promise;
      },
      getFriends: function(conf) {
        var d = $q.defer();
        FBService.then(function(fb) {
          loginPromise.then(function() {
            fb.api('/me/friends', conf || {}, function(resp) {
              d.resolve(resp.data);
            })
          });
        });
        return d.promise;
      },
      // Get more details about a facebook user
      // by their id or their username
      // 
      // Usage:
      // FB.getUser(1234567)
      getUser: function(id) {
        var d = $q.defer();
        FBService.then(function(fb) {
          fb.api('/' + id, function(resp) {
            if (resp.error) d.reject(resp);
            else d.resolve(resp);
          });
        })
        return d.promise;
      },
      getCheckins: function(conf) {
        var d = $q.defer();
        FBService.then(function(fb) {
          loginPromise.then(function() {
            fb.api('me/friends/?fields=checkins', conf || {}, function(resp) {
              console.log(resp);
            })
          })
        })
        return d.promise;
      },
      ui: function(conf) {
        FBService.then(function(fb) {
          return fb.ui(conf);
        })
      }
    }
    return service;
  }
})