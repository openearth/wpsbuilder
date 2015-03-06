'use strict';


describe('Service: wps', function () {

    // load the service's module
    beforeEach(module('wpsbuilderApp'));

    // We should have OpenLayers available
    it('should have OpenLayers available', function() {
        expect(!!OpenLayers.WPSClient).toBe(true);
    });

});
