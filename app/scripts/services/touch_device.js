angular.module('alTouchDevice', [])
.provider('TouchDevice', function() {
  var deviceType = false;
  this.setTouchDevice = function(t) {
    deviceType = true;
  }

  this.$get = function() {return deviceType;}
})