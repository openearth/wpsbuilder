'use strict';

/**
 * @ngdoc function
 * @name wpsbuilderApp.controller:FormCtrl
 * @description
 * # FormCtrl
 * Controller of the wpsbuilderApp
 */
angular.module('wpsbuilderApp')
    .controller('FormCtrl', ['$scope', '$routeParams', 'wps', 'FileUploader', function ($scope, $routeParams, wps, FileUploader) {
        $scope.servers = wps;
        var uploader = $scope.uploader = new FileUploader({
            url: '/upload'
        });
        $scope.inputs = {};
        $scope.files = {};
        $scope.fileinfo = {};
        $scope.server = $routeParams.server;
        $scope.identifier = $routeParams.identifier;
        $scope.description = {};
        // Transform servers to expected format by OpenLayers
        var servers = _.object(_.map($scope.servers, function(server){
            return [server.id, server];
        }));
        // Open a Client
        var client = new OpenLayers.WPSClient({
            servers: servers,
            lazy: false
        });
        $scope.process = client.getProcess($scope.server, $scope.identifier, {
            callback: function(process){
                console.log('got process', process);
            }
        });
        $scope.process.describe({
            callback: function(description){
                console.log('got description', description);
                $scope.description = description;
                // update scope manually
                // because it has nested dictionaries
                if(!$scope.$$phase) {
                    $scope.$digest();
                }

            }
        });
        // Mappings for datatypes
        var literalDataTypes = {
            'string': {type: 'string', reference: 'http://www.w3.org/TR/xmlschema-2/#string', htmltype: 'text', placeholder: 'text'},
            'float': {type: 'float', reference: 'http://www.w3.org/TR/xmlschema-2/#float', htmltype: 'number', placeholder: 'float'},
            'integer': {type: 'integer', reference: 'http://www.w3.org/TR/xmlschema-2/#integer', htmltype: 'number', placeholder: 'integer'},
            'boolean': {type: 'boolean', reference: 'http://www.w3.org/TR/xmlschema-2/#boolean', htmltype: 'checkbox', placeholder: ''}
        };


        $scope.info = function(input){
            var text = _.map(input.complexData.supported.formats, function(value, key){return key;}).join(", ")
            return text;
        };
        // Get the type for a html input
        $scope.getType = function(input){
            if (!!input.literalData) {
                return literalDataTypes[input.literalData.dataType].htmltype;
            } else if (!!input.complexData) {
                return 'email';
            }

            return 'text';
        };

        // Get the placeholder for an input field
        $scope.getPlaceholder = function(input){
            if (!!input.literalData) {
                return input.literalData.DefaultValue || literalDataTypes[input.literalData.dataType].placeholder;
            } else if (!!input.complexData) {
                return input.complexData['default'].formats;
            }
        };

        // Get a callback that gets the input from another source
        // file/input
        $scope.getCallback = function(input){
            if (!!input.literalData) {
                return null;
            }
        };

        $scope.getFeature = function(identifier){
            console.log('Firing getFeature for', identifier);
            var event = new CustomEvent('getFeature', {
                detail: {
                    scope: $scope,
                    callback: function(identifier, data){
                        console.log('Got data for identifier', identifier, ':', data);
                        var text = JSON.stringify(data);
                        $scope.files[identifier] = text;
                        $scope.fileinfo[identifier] = {
                            name: 'drawn on map',
                            size: text.length,
                            type: 'application/json'

                        };
                        if(!$scope.$$phase) {
                            $scope.$digest();
                        }
                    },
                    identifier: identifier
                }
            });
            document.dispatchEvent(event);

        };

        $scope.clearFile = function(identifier){
            // remove files
            delete $scope.files[identifier];
            delete $scope.fileinfo[identifier];
        };
        $scope.execute = function(){
            console.log('Executing with', $scope);
        };

        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            function onLoadFile(event) {
                // store the base64 encoded string
                $scope.files[event.target.fileItem.alias] = btoa(event.target.result);
                // store file info
                $scope.fileinfo[event.target.fileItem.alias] = event.target.fileItem.file;
                if(!$scope.$$phase) {
                    $scope.$digest();
                }
            }
            var reader = new FileReader();
            reader.onload = onLoadFile;
            reader.fileItem = fileItem;
            reader.readAsBinaryString(fileItem._file);
        };


    }]);
