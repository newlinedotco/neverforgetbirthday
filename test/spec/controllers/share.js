'use strict';

describe('Controller: ShareCtrl', function () {

  // load the controller's module
  beforeEach(module('bdayApp'));

  var ShareCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShareCtrl = $controller('ShareCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
