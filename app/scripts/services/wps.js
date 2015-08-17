'use strict';

/**
 * @ngdoc service
 * @name wpsbuilderApp.wps
 * @description
 * # wps
 * Factory in the wpsbuilderApp.
 */

angular.module('wpsbuilderApp')
    .factory('wps', function(){
        var servers = [
            {
                id: 'openearth',
                title: 'OpenEarth',
                url: 'http://wps.openearth.nl/wps',
                capabilities: {},
                processDescription: {},
                version: '1.0.0'
            },
            {
                id: 'dtvirt5',
                title: 'OpenEarth development',
                url: 'http://dtvirt5.deltares.nl/wps',
                capabilities: {},
                processDescription: {},
                version: '1.0.0'
            },
            {
                id: '52north',
                title: '52 North demo server',
                url: 'http://geoprocessing.demo.52north.org:8080/wps/WebProcessingService',
                capabilities: {},
                processDescription: {},
                version: '1.0.0'
            },
            // No Access-Control-Allow-Origin
            // {
            //     id: 'fmach',
            //     title: 'Edmund Mach Foundation',
            //     url: 'http://geodati.fmach.it/zoo',
            //     capabilities: {},
            //     processDescription: {},
            //     version: '1.0.0'
            // }
            // {
            //     id: 'zoo-grass',
            //     title: 'Zoo grass server',
            //     url: 'http://zoo-project.org/cgi-grass/zoo_loader.cgi',
            //     capabilities: {},
            //     processDescription: {},
            //     version: '1.0.0'
            // }
        ];
        if (document.location.origin.match('localhost')) {
            // local pywps
            var localhost = {
                id: 'localhost',
                title: 'Local machine',
                url: 'http://localhost:6543',
                capabilities: {},
                processDescription: {},
                version: '1.0.0'
            };
            console.log('adding', localhost);
            servers.push(localhost);
        }
        return servers;
    });
