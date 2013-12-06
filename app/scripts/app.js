'use strict';

angular.module('bdayApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'alFacebook',
  'alSqoot',
  'pasvaz.bindonce',
  'alAuth'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/share/:idx', {
        templateUrl: 'views/share.html',
        controller: 'ShareCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function(FBServiceProvider) {
    FBServiceProvider.init({
      appId: '1378810232369883',
      channelUrl: '//' + window.location.hostname+'/fbChannel.html',
      status: true,
      cookie: true,
      xfbml: false
    });
  })
  .config(function(SqootProvider) {
    SqootProvider.setApiKey('kbz14v');
  })
