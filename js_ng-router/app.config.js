// JavaScript Document
"use strict";

app.config(['config',
'$httpProvider',

'$routeProvider', function(config, $httpProvider, $routeProvider) {
	config.test = "Keith";
	
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    // $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
    // $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.useXDomain = true;

	// this is important
	// app.controller = $controllerProvider.register;
	// app.directive = $compileProvider.directive;
	// app.filter = $filterProvider.register;
	// app.factory = $provide.factory;
	// app.service = $provide.service;
	// app.constant = $provide.constant;
	// app.value = $provide.value;
	// this is important - End


	$routeProvider
	.when('/demoHome/demo', {
		templateUrl: '../demo/home.html',
		// controller: 'BookController'
		// resolve: {
		//   // I will cause a 1 second delay
		//   delay: function($q, $timeout) {
		//     var delay = $q.defer();
		//     $timeout(delay.resolve, 1000);
		//     return delay.promise;
		//   }
		// }
	})
	.when('/demoHome/00login-logout', {
		templateUrl: '../demo/00login-logout.html',
	})
	.when('/demoHome/01directive-entry', {
		templateUrl: '../demo/01directive-entry.html',
	})
	.when('/demoHome/02directive-pageview', {
		templateUrl: '../demo/02directive-pageview.html',
	})
	.when('/demoHome/03directive-screen', {
		templateUrl: '../demo/03directive-screen.html',
	})
	.when('/demoHome/04directive-editbox', {
		templateUrl: '../demo/04directive-editbox.html',
	})
	.when('/demoHome/05directive-message', {
		templateUrl: '../demo/05directive-message.html',
	})
	.when('/demoHome/06directive-export', {
		templateUrl: '../demo/06directive-export.html',
	})
	.when('/demoHome/07directive-upload', {
		templateUrl: '../demo/07directive-upload.html',
	})
	.when('/demoHome/08directive-import', {
		templateUrl: '../demo/08directive-import.html',
	})
	.when('/demoHome/09directive-process', {
		templateUrl: '../demo/09directive-process.html',
	})
	.when('/demoHome/10directive-range', {
		templateUrl: '../demo/10directive-range.html',
	})
	.when('/demoHome/11create-master-data', {
		templateUrl: '../demo/11create-master-data.html',
		controller: 'createDepartmentController'
	})
	.when('/demoHome/12view-master-data', {
		templateUrl: '../demo/12view-master-data.html',
		controller: 'viewDepartmentController'
	})
	.when('/demoHome/13amend-master-data', {
		templateUrl: '../demo/13amend-master-data.html',
		controller: 'amendDepartmentController'
	})
	.when('/demoHome/14delete-master-data', {
		templateUrl: '../demo/14delete-master-data.html',
		controller: 'deleteDepartmentController'
	})
	.when('/demoHome/15display-inline-message', {
		templateUrl: '../demo/15display-inline-message.html',
		controller: 'displayMessageController'
	})
	.when('/demoHome/16reusable-screen', {
		templateUrl: '../demo/16reusable-screen.html',
		controller: 'reuseController'
	})
	.when('/demoHome/20range-selection', {
		templateUrl: '../demo/20range-selection.html',
		controller: 'rangeController'
	})
	.when('/demoHome/21create-staff-profile', {
		templateUrl: '../demo/21create-staff-profile.html',
		controller: 'staffProfileCreateController'
	})
	.when('/demoHome/23amend-staff-profile', {
		templateUrl: '../demo/23amend-staff-profile.html',
		controller: 'staffProfileAmendController'
	})
	.otherwise('demoHome/demo');


}]);