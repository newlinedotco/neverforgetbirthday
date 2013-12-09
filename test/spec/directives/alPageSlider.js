'use strict';

describe('Directive: alPageSlider', function () {

  // load the directive's module
  beforeEach(module('bdayApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<al-page-slider></al-page-slider>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the alPageSlider directive');
  }));
});
