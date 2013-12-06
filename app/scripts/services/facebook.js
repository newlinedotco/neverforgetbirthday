angular.module('alFacebook', [])
.provider('FBService', function() {
  var _asyncLoading = false
  , _scriptUrl = '//connect.facebook.net/en_US/all.js'
  , _scriptId = 'facebook-jssdk'
  , _fbConfig = null
  , _channelUrl = 'app/channel.html'
  , _status = true
  , _cookie = true
  , _xfbml = true;

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
    scriptTag.onload = callback;
    var s = $document.getElementsByTagName('body')[0];
        s.appendChild(scriptTag);
  }

  this.$get = function($document, $timeout, $q, $rootScope, $window) {
    var  deferred = $q.defer(),
      _FB = $window.FB,
      self = this;

    function successFN() {
     $window.fbAsyncInit = function() {
       // Executed when the SDK is loaded
       FB.init(_fbConfig);
     };
    }

    deferred.isPromise = true;

     // Load client in the browser
    var onScriptLoad = function(callback) {
      successFN();
      $timeout(function() {
        deferred.resolve($window.FB);
      });
    };

    createScript($document[0], onScriptLoad);
    return deferred.promise;
   }
})
.provider('FB', function() {
  this.$get = function($rootScope, $q, FBService) {
    var loginDefer = $q.defer(),
        loginPromise = loginDefer.promise;

    // On init
    FBService.then(function(fb) {
      fb.Event.subscribe('auth.authResponseChange', 
        function(res) {
          if (res.status === 'connected') {
            loginDefer.resolve(res);
          }
        }
      )
    });

    var service = {
      login: function(scope) {
        FBService.then(function(fb) {
          fb.Event.subscribe('auth.authResponseChange', 
            function(res) {
              if(res.status === 'connected') {
                localStorage.setItem('auth', JSON.stringify(res));
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