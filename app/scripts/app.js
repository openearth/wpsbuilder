'use strict';
/**
 * @ngdoc overview
 * @name wpsbuilderApp
 * @description
 * # Module that generates forms for WPS processes
 *
 * Main module of the application.
 */
angular
    .module('wpsbuilderApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'angularFileUpload',
        'ui.bootstrap'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/list.html',
                controller: 'ListCtrl'
            })
            .when('/form/:server/:identifier', {
                templateUrl: 'views/form.html',
                controller: 'FormCtrl'
            })
            .when('/custom/:server/:identifier', {
                templateUrl: function(routeParams){
                    console.log('Applying custom template for', routeParams);
                    return 'views/' + routeParams.server + '/' + routeParams.identifier + '.html';
                },
                controller: 'FormCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

