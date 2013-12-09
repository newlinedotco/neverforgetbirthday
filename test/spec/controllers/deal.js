'use strict';

describe('Controller: DealCtrl', function () {

  // load the controller's module
  beforeEach(module('bdayApp'));

  var DealCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DealCtrl = $controller('DealCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
