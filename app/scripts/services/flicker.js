// /feeds/photos_public.gne?format=json
angular.module('alFlicker', [])
.provider('Flicker', function() {
  var base = 'http://api.flickr.com/services';

  this.$get = function($q, $http) {
    var service = {
      getPublicFeed: function() {
        var d = $q.defer();
        $http({
          method: 'JSONP',
          url: base + '/feeds/photos_public.gne?format=json',
          params: {
            'jsoncallback': 'JSON_CALLBACK'
          }
        }).success(function(data) {
          d.resolve(data);
        }).error(function(reason) {
          d.reject(reason);
        })
        return d.promise;
      }
    };

    return service;
  }
})