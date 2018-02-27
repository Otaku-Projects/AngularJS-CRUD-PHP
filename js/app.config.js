// JavaScript Document
"use strict";

app.config(['config',
'$httpProvider',
'$locationProvider',
'$controllerProvider',
'$compileProvider',
'$filterProvider',
'$provide',
'$ocLazyLoadProvider',

'$urlRouterProvider',
'$stateProvider',

function(config, $httpProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, $urlRouterProvider, $stateProvider) {
	config.test = "Keith";
	
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    // $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
    // $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.useXDomain = true;
}]);