'use strict';

describe('Controller: FrameCtrl', function () {

  // load the controller's module
  beforeEach(module('bdayApp'));

  var FrameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FrameCtrl = $controller('FrameCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
