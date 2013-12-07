'use strict';

angular.module('bdayApp')
  .controller('FrameCtrl', function ($scope, FB, TouchDevice) {
    $scope.touch = TouchDevice;

    $scope.login = function() {
      FB.login('user_birthday,user_about_me,user_checkins,friends_checkins')
      .then(function(resp) {
        console.log("GOT", resp);
        $scope.userLoggedIn = true;
      })
    }
    FB.loggedIn().then(function() {
      $scope.userLoggedIn = true;
    }, function() {
      $scope.userLoggedIn = false;
    });

    $scope.logout = function() {
      FB.logout()
      .then(function() {
        $scope.userLoggedIn = false;
        $scope.profile = {}
      })
    }
  });
