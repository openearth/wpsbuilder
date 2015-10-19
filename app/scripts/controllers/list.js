'use strict';
/* globals OpenLayers */

/**
 * @ngdoc function
 * @name wpsbuilderApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the wpsbuilderApp
 */
angular.module('wpsbuilderApp')
    .controller('ListCtrl', ['$scope', 'wps', 'FileUploader', function ($scope, wps, FileUploader) {
        // List of all the servers that we want to access
        $scope.servers = wps;
        $scope.uploader = new FileUploader({
            url: '/upload'
        });

        function getCapabilities(server) {
            OpenLayers.Request.GET({
                url: server.url,
                params: {
                    'SERVICE': 'WPS',
                    'REQUEST': 'GetCapabilities',
                    'VERSION': server.version
                },
                success: function(response){
                    var capabilities = new OpenLayers.Format.WPSCapabilities().read(
                        response.responseText
                    );
                    server.capabilities = capabilities;
                    if(!$scope.$$phase) {
                        $scope.$digest();
                    }
                }
            });
        }

        $scope.update = function(){
            _.each($scope.servers, getCapabilities);

        };
        $scope.update();

    }]);
