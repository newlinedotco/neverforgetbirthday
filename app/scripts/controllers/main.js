'use strict';

angular.module('bdayApp')
  .controller('MainCtrl', function($scope, $filter, FB, Groupon) {
    $scope.login = function() {
      FB.login('user_birthday,user_about_me,user_checkins,friends_checkins')
      .then(function(resp) {
        $scope.userLoggedIn = true;
      })
    }
    FB.loggedIn().then(function() {
      $scope.userLoggedIn = true;
    }, function() {
      $scope.userLoggedIn = false;
    })

    FB.getProfile()
    .then(function(profile) {
      var split = profile.birthday.split('/'),
          month = split[0] - 1,
          day   = split[1],
          year  = split[2] || new Date().getFullYear();

      profile['birthday'] = new Date(year, month, day);
      profile['formatted_birthday'] = $filter('date')(profile['birthday'], 'MMMM d');
      $scope.profile = profile;
      Groupon.getDeals({
        location: profile.location.name,
        radius: 50
      }).then(function(data) {
        console.log(data);
        $scope.deals = data.deals;
      }, function(err) {
        console.error(err);
      })
    });

    $scope.logout = function() {
      FB.logout()
      .then(function() {
        $scope.userLoggedIn = false;
        $scope.profile = {}
      })
    }
  });
