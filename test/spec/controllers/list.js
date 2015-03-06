'use strict';

describe('Controller: ListCtrl', function () {

  // load the controller's module
  beforeEach(module('wpsbuilderApp'));

  var ListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListCtrl = $controller('ListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of servers to the scope', function () {
    expect(scope.servers.length).toBe(2);
  });
});
