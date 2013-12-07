'use strict';

angular.module('bdayApp')
  .controller('ShareCtrl', function($scope, $routeParams, shareUser, FB, Groupon) {
    var conf = {};

    if (shareUser.location) {
      conf['location'] = shareUser.location.name;
    }
    Groupon.getDeals(conf)
    .then(function(deal) {
      $scope.deals = deal.deals;
    });
    $scope.user = shareUser;

    $scope.shareWith = function(id) {
      var conf = {
        method: 'send',
        link: $scope.deal.untracked_url,
        to: id
      }
      FB.ui(conf);
    }

  });
