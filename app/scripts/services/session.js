'use strict';

angular.module('bdayApp')
  .service('Session', function Session() {

    this.currentDeal = ''
    this.currentUser = ''

    this.setCurrentDeal = function(deal) {
      this.currentDeal = deal;
    };
    this.setCurrentUser = function(user) {
      this.currentUser = user;
    };

  });
