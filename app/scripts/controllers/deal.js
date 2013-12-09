'use strict';

angular.module('bdayApp')
  .controller('DealCtrl', function ($scope, Session) {

    $scope.deal = Session.currentDeal;
    $scope.user = Session.currentUser;

  });
