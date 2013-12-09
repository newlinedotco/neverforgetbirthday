'use strict';

angular.module('bdayApp')
  .controller('MainCtrl', function($rootScope, $scope, $filter, FB, Groupon) {

    $scope.$on('user:login', function() {
      updateFriends();
    });

    // Set our default variables  
    var offset = 0,
        limit = 64;

    // Basically just set our offset so that we
    // don't fetch negative friends
    var sanitizeRequestFeatures = function() {
      if (offset < 0) offset = 0;
    }
    // Update our friends list on the local scope
    var updateFriends = function() {
      sanitizeRequestFeatures();
      FB.getFriends({
        fields: 'name,birthday,id,picture,location',
        limit: limit,
        offset: offset
      })
      .then(function(friends) {
        var arr = []
        angular.forEach(friends, function(value, key){
          if (value.birthday) {
            var split = value.birthday.split('/'),
                month = split[0],
                day   = split[1],
                year  = split[2] || new Date().getFullYear();
            value['birthday'] = new Date(year, month, day);
            value['formatted_birthday'] = $filter('date')(value['birthday'], 'MMMM dd')
            arr.push(value);
          }
        });
        $scope.friends = $filter('orderBy')(arr, 'birthday');
        $scope.loading = false;
      })
    }

    updateFriends();
    $scope.nextPage = function() {
      $scope.loading = 'next';
      offset += limit;
      updateFriends();
    }
    $scope.prevPage = function() {
      $scope.loading = 'prev';
      offset -= limit;
      updateFriends();
    }
  });
