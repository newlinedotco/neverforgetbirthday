'use strict';

angular.module('bdayApp')
  .controller('ShareCtrl', function($scope, $routeParams, FB, Groupon) {

    Groupon.getDeal($routeParams.idx)
    .then(function(deal) {
      $scope.deal = deal;
      FB.getFriends({
        fields: 'username,id,name'
      })
      .then(function(friends) {
        $scope.friends = friends;
      })
    });

    $scope.shareWith = function(id) {
      var conf = {
        method: 'send',
        link: $scope.deal.untracked_url,
        to: id
      }
      console.log(conf, $scope.deal);
      FB.ui(conf);
    }

  });
