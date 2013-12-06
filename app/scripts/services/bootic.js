angular.module('bootic', [])
.provider('Bootic', function() {
  this.url = 'https://thebootic-bootic-product-search.p.mashape.com/'

  this.$get = function($q, $http) {
    var service = {
      search: function(query, conf) {
        var d = $q.defer();
        conf = conf || {};
        $http({
          method: 'GET',
          url: self.url + '/products',
          params: {
            'q': query,
            'limit': conf.limit || 50,
            'offset': conf.offset || 100,
            'price_max': conf.price_max || 100
          },
          headers: {
          }
        })
        return d.promise;
      }
    };
    return service;
  }
})