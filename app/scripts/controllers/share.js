'use strict';

angular.module('bdayApp')
  .controller('ShareCtrl', function($scope, $routeParams, FB, Groupon) {

    FB.getUser($routeParams.idx)
    .then(function(user) {
      var conf = {};

      if (user.location) {
        conf['location'] = user.location.name;
      }
      Groupon.getDeals(conf)
      .then(function(deal) {
        $scope.deals = deal.deals;
      });
      $scope.user = user;
    })

    console.log(Modernizr.touch);

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
