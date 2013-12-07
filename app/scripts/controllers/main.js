'use strict';

angular.module('bdayApp')
  .controller('MainCtrl', function($scope, $filter, FB, Groupon) {

    // FB.getProfile()
    // .then(function(profile) {
    //   var split = profile.birthday.split('/'),
    //       month = split[0] - 1,
    //       day   = split[1],
    //       year  = split[2] || new Date().getFullYear();

    //   profile['birthday'] = new Date(year, month, day);
    //   profile['formatted_birthday'] = $filter('date')(profile['birthday'], 'MMMM d');
    //   $scope.profile = profile;
      var offset = 0,
          limit = 64;

      var sanitizeRequestFeatures = function() {
        if (offset < 0) offset = 0;
      }
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
      // Groupon.getDeals({
      //   location: profile.location.name,
      //   radius: 50
      // }).then(function(data) {
      //   console.log(data);
      //   $scope.deals = data.deals;
      // }, function(err) {
      //   console.error(err);
      // });
    // });

  });
