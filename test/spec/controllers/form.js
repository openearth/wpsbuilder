'use strict';

describe('Controller: FormCtrl', function () {

    // load the controller's module
    beforeEach(module('wpsbuilderApp'));

    var FormCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        // Create an empty scope
        scope = $rootScope.$new();
        // Create a mock request
        var routeParams = {
            server: 'openearth',
            identifier: 'tidal_predict'
        };
        FormCtrl = $controller('FormCtrl', {
            $scope: scope,
            $routeParams: routeParams
        });
    }));

    it('should attach have servers in the scope', function () {
        expect(scope.servers.length).toBeGreaterThan(2);
    });
});
