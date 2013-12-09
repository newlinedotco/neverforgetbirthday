'use strict';

angular.module('bdayApp')
  .controller('ShareCtrl', function($scope, $routeParams, shareUser, FB, Groupon, Session) {
    var conf = {};

    if (shareUser.location) {
      conf['location'] = shareUser.location.name;
    }
    Groupon.getDeals(conf)
    .then(function(deal) {
      $scope.deals = deal.deals;
    });
    $scope.user = shareUser;

    $scope.setDeal = function(deal) {
      Session.setCurrentDeal(deal);
      Session.setCurrentUser($scope.user);
    }

    $scope.shareWith = function(id) {
      var conf = {
        method: 'send',
        link: $scope.deal.untracked_url,
        to: id
      }
      FB.ui(conf);
    }

  });
