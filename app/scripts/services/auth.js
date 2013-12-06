angular.module('alAuth', ['alFacebook'])
.provider('Auth', function() {

  this.$get = function($q, FB) {
    var service = {
      login: function(scope) {return FB.login(scope);},
      logout: function() {return FB.logout();}
    };
    return service;
  }
})