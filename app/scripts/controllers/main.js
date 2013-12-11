'use strict';

angular.module('bdayApp')
  .controller('MainCtrl', function($rootScope, $timeout, $scope, $q, $filter, FB, Groupon) {
    // Set our default variables  
    var currOffset = 0,
        limit = 32;

    $scope.$on('user:login', function() {
      updateFriends(currOffset);
    });

    // Basically just set our offset so that we
    // don't fetch negative friends
    var sanitizeRequestFeatures = function(offset) {
      if (offset < 0) offset = 0;
    }
    // Update our friends list on the local scope
    var updateFriends = function(offset) {
      var d = $q.defer();
      // Otherwise make a request to Facebook with the 
      // limit and the offset
      FB.getFriends({
        fields: 'name,birthday,id,picture,location',
        limit: limit,
        offset: offset
      })
      .then(function(friends) {
        var arr = []
        // For every single one of our objects,
        // we'll walk through and look for a birthday.
        // If no birthday is found, simply move on. 
        // otherwise, we'll parse their birthday into 
        // the month and the day and save it to the list
        // of friends to pass back
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
        // Finally, order the array by birthday
        var output = $filter('orderBy')(arr, 'birthday');
        // and save the result into the friends-offset
        // location in localstorage for later.
        localStorage.setItem('friends-'+offset, JSON.stringify(output));
        d.resolve(output);
      })
      // Return a promise
      return d.promise;
    }

    // When the page first loads, let's
    // load the friends for the first time and 
    // store the output as $scope.friends
    updateFriends(currOffset)
    .then(function(friends) {
      $scope.friends = friends;
    });
    
    // Update to the next page
    // by updating the currentOffset
    // and recalling updateFriends
    // to fetch from Facebook or localstorage
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

  });
