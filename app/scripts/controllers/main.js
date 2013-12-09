'use strict';

angular.module('bdayApp')
  .controller('MainCtrl', function($rootScope, $scope, $q, $filter, FB, Groupon) {

    $scope.$on('user:login', function() {
      updateFriends();
    });

    // Set our default variables  
    var currOffset = 0,
        limit = 64;

    // Basically just set our offset so that we
    // don't fetch negative friends
    var sanitizeRequestFeatures = function(offset) {
      if (offset < 0) offset = 0;
    }
    // Update our friends list on the local scope
    var updateFriends = function(offset) {
      var d = $q.defer();
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
        $scope.loading = false;
        d.resolve($filter('orderBy')(arr, 'birthday'));
      })
      return d.promise;
    }

    updateFriends().then(function(friends) {
      $scope.friends = friends;
    })
    $scope.nextPage = function() {
      $scope.loading = 'next';
      currOffset += limit;
      updateFriends(currOffset)
      .then(function(friends) {
        $scope.friends = friends;
      });
    }
    $scope.prevPage = function() {
      $scope.loading = 'prev';
      currOffset -= limit;
      updateFriends(currOffset)
      .then(function(friends) {
        $scope.friends = friends;
      });
    }
    $scope.preloadNext = function() {
      updateFriends(currOffset+limit)
      .then(function(nextFriends) {
        $scope.nextFriends = nextFriends;
      });
    }
    $scope.preloadPrev = function() {
      updateFriends(currOffset-limit)
      .then(function(nextFriends) {
        $scope.nextFriends = nextFriends;
      });
    }
  });
