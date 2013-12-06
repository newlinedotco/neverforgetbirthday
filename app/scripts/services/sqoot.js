angular.module('alSqoot', [])
.provider('Sqoot', function() {
  this.url = 'http://api.sqoot.com/v2';

  this.api_key = '';
  this.setApiKey = function(key) {
    this.api_key = key || this.api_key;
    return this;
  }

  this.$get = function($q, $http) {
    var self = this;

    var service = {
      getDeals: function(conf) {
        var d = $q.defer();
        conf = conf || {};
        conf['api_key'] = self.api_key;
        $http({
          method: 'GET',
          url: self.url + '/deals',
          params: conf
        }).success(function(data) {
          d.resolve(data);
        }).error(function(reason) {
          d.reject(reason);
        })
        return d.promise;
      },
      getDeal: function(id) {
        var d = $q.defer();
        $http({
          method: 'GET',
          url: self.url + '/deals/' + id,
          params: {
            api_key: self.api_key
          }
        }).success(function(data) {
          d.resolve(data.deal);
        }).error(function(reason) {
          d.reject(reason);
        })
        return d.promise;
      }
    };
    return service;
  }
})