'use strict';

/* globals angular, OpenLayers, _, console, moment */

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
        $scope.raw = '';
        $scope.href = '';
        $scope.result = {};
        $scope.status = {
            'tag': '',
            'text': ''
        };
        $scope.output = {
            tag: 'div',
            content: '',
            src: ''
        };
        $scope.responseText = '';
        // Transform servers to expected format by OpenLayers
        var servers = _.object(_.map($scope.servers, function(server){
            return [server.id, server];
        }));
        // Open a Client
        var client = new OpenLayers.WPSClient({
            servers: servers,
            lazy: false
        });
        client.events.on({describeprocess: function(evt){
            // raw xml
            $scope.raw = evt.raw;
        }});
        $scope.process = client.getProcess($scope.server, $scope.identifier, {
            callback: function(process){
                console.log('got process', process);
            }
        });

// Mappings for datatypes
        var literalDataTypes = {
            'string': {
                type: 'string',
                reference: 'http://www.w3.org/TR/xmlschema-2/#string',
                htmltype: 'text',
                placeholder: 'text',
                converter: function(x) { return x;}
            },
            'float': {
                type: 'float',
                reference: 'http://www.w3.org/TR/xmlschema-2/#float',
                htmltype: 'number',
                placeholder: 'float',
                converter: function(x) { return parseFloat(x);}
            },
            'integer': {
                type: 'integer',
                reference: 'http://www.w3.org/TR/xmlschema-2/#integer',
                htmltype: 'number',
                placeholder: 'integer',
                converter: function(x){ return parseInt(x);}
            },
            'boolean': {
                type: 'boolean',
                reference: 'http://www.w3.org/TR/xmlschema-2/#boolean',
                htmltype: 'checkbox',
                placeholder: '',
                converter: function(x){
                    // test for boolean
                    var falsy = /^(?:f(?:alse)?|no?|0+)$/i;
                    return !falsy.test(x) && !!x;
                }
            },
            'dateTime': {
                type: 'dateTime',
                reference: 'http://www.w3.org/TR/xmlschema-2/#dateTime',
                htmltype: 'date',
                placeholder: '',
                converter: function(x){
                    var date = new moment(x);
                    if (date.isValid()) {
                        return date;
                    } else {
                        // if not converted return original
                        return x;
                    }
                }
            },
            'date': {
                type: 'date',
                reference: 'http://www.w3.org/TR/xmlschema-2/#date',
                htmltype: 'date',
                placeholder: '',
                converter: function(x){
                    return new moment(x);
                }

            }
        };

        $scope.process.describe({
            callback: function(description){
                console.log('got description', description);
                $scope.description = description;
                // update values to defaults
                _.each(
                    description.dataInputs,
                    function(input){
                        if (input.literalData) {
                            console.log('defaults in', input, this);
                            if (input.literalData.defaultValue) {
                                var converter = literalDataTypes[input.literalData.dataType].converter;
                                $scope.inputs[input.identifier] = converter(input.literalData.defaultValue);
                            }
                        }
                    },
                    {}
                );
                // update scope manually
                // because it has nested dictionaries
                if(!$scope.$$phase) {
                    $scope.$digest();
                }

            }
        });



        $scope.info = function(input){
            var text = _.map(
                input.complexData.supported.formats,
                function(value, key){return key;}
            ).join(', ');
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

        $scope.getDefault = function(input) {
            if (!!input.literalData) {
                return input.literalData.defaultValue;
            } else {
                return '';
            }
        };

        // Get the placeholder for an input field
        $scope.getPlaceholder = function(input){
            if (!!input.literalData) {
                return input.literalData.defaultValue || literalDataTypes[input.literalData.dataType].placeholder;
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
            // use initCustomEvent if you want IE support
            // https://msdn.microsoft.com/en-us/library/ie/ff975299(v=vs.85).aspx
            var event = new CustomEvent('getFeature', {
                detail: {
                    scope: $scope,
                    callback: function(identifier, data){
                        $scope.files[identifier] = data;
                        $scope.fileinfo[identifier] = {
                            name: 'drawn on map',
                            size: data.length,
                            type: 'application/json'

                        };
                        if(!$scope.$$phase) {
                            $scope.$digest();
                        }
                        console.log('feature', data);

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
            var options = {
                server: $scope.server,
                process: $scope.identifier,
                inputs: _.extend({}, $scope.inputs, $scope.files),
                success: function(outputs){
                    console.log(outputs);
                    $scope.result = outputs.result;
                    // fire a custom even twhen the document results are ready
                    var event = new CustomEvent('response', {
                        detail: {
                            scope: $scope,
                            output: outputs,
                            identifier: $scope.identifier
                        }
                    });
                    document.dispatchEvent(event);
                    $scope.responseText = outputs.responseText;
                    if(!$scope.$$phase) {
                        $scope.$digest();
                    }
                }
            };
            client.execute(options);

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
