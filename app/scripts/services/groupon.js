angular.module('alGroupon', [])
.provider('Groupon', function() {
  var api_key = '',
      baseUrl = '//api.groupon.com/v2';

  this.setApiKey = function(key) {
    api_key = key || api_key
  }

  this.$get = ['$q', '$http', function($q, $http) {
    var service = {
      // Get all deals
      getDeals: function(conf) {
        var d = $q.defer();
        // Ensure we have a config option
        conf = conf || {}
        // Set the callback and the client_id
        // in the config object
        conf['callback'] = 'JSON_CALLBACK';
        conf['client_id'] = api_key

        // Execute the request in the background
        $http({
          method: 'JSONP',
          url: baseUrl + '/deals.json',
          params: conf
        }).success(function(data) {
          d.resolve(data);
        }).error(function(reason) {
          d.reject(reason);
        })
        return d.promise;
      },
      // Get a deal by ID
      // -----------------
      getDeal: function(id) {
        var d = $q.defer();
        // Execute the request
        $http.jsonp(baseUrl + '/deals/' + id + '.json', {
          params: {
            client_id: api_key,
            callback: 'JSON_CALLBACK'
          }
        })
        .success(function(data) {
          d.resolve(data.deal);
        }).error(function(reason) {
          d.reject(reason);
        });
        return d.promise;
      }
    }

    return service;
  }]

})