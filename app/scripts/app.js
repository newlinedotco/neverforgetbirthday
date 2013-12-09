'use strict';


// Define our app bdayApp module
// along with its dependencies.
// 
// We'll need to include routes, cookies
// our Facebook interface, the bindonce
// library
angular.module('bdayApp', [
  'ngCookies',
  'ngRoute',
  'ngTouch',
  'ngAnimate',
  'alTouchDevice',
  'alFacebook',
  'alGroupon',
  'pasvaz.bindonce'
])
  .config(function ($routeProvider) {
    // Setting up our routes
    // ---------------------
    $routeProvider
      // We define a main route that serves as our
      // homepage
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        depth: 1
      })
      // We also define a share page
      .when('/share/:idx', {
        templateUrl: 'views/share.html',
        controller: 'ShareCtrl',
        depth: 2,
        resolve: {
          shareUser: ['$route', 'FB', function($route, FB) {
            return FB.getUser($route.current.params.idx);
          }]
        }
      })
      // Otherwise we'll set our homepage
      .when('/deal', {
        templateUrl: 'views/deal.html',
        depth: 3,
        controller: 'DealCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function(FBServiceProvider) {
    // Using our Facebook key, we're 
    FBServiceProvider.init({
      appId: '1378810232369883',
      status: true,
      cookie: true,
      xfbml: false
    });
  })
  .config(function(GrouponProvider) {
    GrouponProvider.setApiKey('01989e50ac648b3056ccc30231300f14c5da8c90');
  })
  .config(function(TouchDeviceProvider) {
    if (Modernizr.touch) TouchDeviceProvider.setTouchDevice();
  })
  .run(function() {
    FastClick.attach(document.body);
  })