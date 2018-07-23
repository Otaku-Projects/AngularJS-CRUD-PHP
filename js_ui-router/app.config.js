// JavaScript Document
"use strict";

app.constant('config', {
	serverHost: serverHost,
	webRoot: webRoot,
	requireLoginPage: requireLoginPage,
	afterLoginPage: afterLoginPage,
	dataServer: dataServer,
	
	uiTheme: theme,
	icon: icon,
	
	editMode: {
		None: 0,
		NUll: 1,
		
		Create: 5,
		Amend: 6,
		Delete: 7,
		View: 8,
		AmendAndDelete: 9,
		ImportExport: 10,
		Import: 11,
		Export: 12,
		
		Copy: 15,
		Fulllist: 20,
		Pageview: 21,
		Scrollview: 22
	},
	
	reservedPath: reservedPath,
	CookiesEffectivePath: CookiesEffectivePath,
    
    debugLog: {
        AllLogging: false,
        PageRecordsLimitDefault: true,
        LockControl: false,
        UnlockControl: false,
        TableStructureObtained: true,
		DirectiveFlow: false,
        ShowCallStack: false
    }
});

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

'LightboxProvider',

function(config, $httpProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, $urlRouterProvider, $stateProvider, LightboxProvider) {
	config.test = "Keith";
	
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    // $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
    // $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
	$httpProvider.defaults.useXDomain = true;
	
	LightboxProvider.fullScreenMode = true;

	// this is important
	app.controller = $controllerProvider.register;
	app.directive = $compileProvider.directive;
	app.filter = $filterProvider.register;
	app.factory = $provide.factory;
	app.service = $provide.service;
	app.constant = $provide.constant;
	app.value = $provide.value;
	// this is important - End
	
	// third-party routing and loading controller before render the template
	/**
	 * for more details please study 
	 * https://oclazyload.readme.io/docs/with-your-router
	 * http://www.funnyant.com/angularjs-ui-router/
	 * https://github.com/ocombe/ocLazyLoad/issues/182
	 */
	$urlRouterProvider
	// redirect
	// .when('/legacy-route', {
	// 	redirectTo: '/'
	// })
	.otherwise('/demoHome');

	// AngularJS routing and anchor hash
	// https://stackoverflow.com/questions/30071821/angularjs-routing-and-anchor-hash
	// reference: https://stackoverflow.com/questions/13345927/angular-routing-overrides-href-behavior-utilized-by-tab-and-collapse-panel-plugi
	// $locationProvider.html5Mode(true);
	//   $locationProvider.html5Mode({
	// 	  enabled: false,
	// 	  requireBase: false,
	// 	  rewriteLinks: true
	// 	});
	// $locationProvider.hashPrefix('!');
	// e.g
	// <a href="#javascript" target="_self"
	// <a data-target="#javascript" for bootstrap controls

	var templateState = {
		name: "demoHome.pageName",
		url: "/urlName", // root route
		views: {
			"content": {
                templateUrl: 'templates.html',
                controller: 'templateCtrl'
			},
			resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
				loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				  // you can lazy load files for an existing module
				         return $ocLazyLoad.load('js/AppCtrl.js');
				}]
			}
		}
	}

	var homeState = {
		name: "demoHome",
		url: "/demoHome", // root route
		views: {
			"navmenu":{
				templateUrl: '../demo/navigation-menu.html',
			},
			"content": {
				templateUrl: '../demo/home.html',
			}
		},
		// resolve: {
		// 	loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
		// 		return $ocLazyLoad.load('./js/demo.js');
		// 	}]
		// }
	}
	var spec_01 = {
		name: "demoHome.spec01-sys-block-diagram",
		url: "/spec01-sys-block-diagram",
		views: {
			"content@": {
				templateUrl: '../demo/spec01-sys-block-diagram.html',
				caption: 'Optional caption',
                controller: 'specServerArchitectureController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/spec01-sys-block-diagram.js');
			}]
		}
	}
	var spec_02 = {
		name: "demoHome.spec02-client-architecture",
		url: "/spec02-client-architecture",
		views: {
			"content@": {
				templateUrl: '../demo/spec02-client-architecture.html',
                controller: 'specClientArchitectureController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/spec02-client-architecture.js');
			}]
		}
	}

	var demo_00 = {
		name: "demoHome.00login-logout",
		url: "/00login-logout",
		views: {
			"content@": {
				templateUrl: '../demo/00login-logout.html',
			}
		}
	}
	var demo_01 = {
		name: "demoHome.01directive-entry",
		url: "/01directive-entry",
		views: {
			"content@": {
				templateUrl: '../demo/01directive-entry.html',
			}
		}
	}
	var demo_02 = {
		name: "demoHome.02directive-pageview",
		url: "/02directive-pageview",
		views: {
			"content@": {
				templateUrl: '../demo/02directive-pageview.html',
			}
		}
	}
	var demo_03 = {
		name: "demoHome.03directive-screen",
		url: "/03directive-screen",
		views: {
			"content@": {
				templateUrl: '../demo/03directive-screen.html',
			}
		}
	}
	var demo_04 = {
		name: "demoHome.04directive-editbox",
		url: "/04directive-editbox",
		views: {
			"content@": {
				templateUrl: '../demo/04directive-editbox.html',
			}
		}
	}
	var demo_05 = {
		name: "demoHome.05directive-message",
		url: "/05directive-message",
		views: {
			"content@": {
				templateUrl: '../demo/05directive-message.html',
			}
		}
	}
	var demo_06 = {
		name: "demoHome.06directive-export",
		url: "/06directive-export",
		views: {
			"content@": {
				templateUrl: '../demo/06directive-export.html',
			}
		}
	}
	var demo_07 = {
		name: "demoHome.07directive-upload",
		url: "/07directive-upload",
		views: {
			"content@": {
				templateUrl: '../demo/07directive-upload.html',
			}
		}
	}
	var demo_08 = {
		name: "demoHome.08directive-import",
		url: "/08directive-import",
		views: {
			"content@": {
				templateUrl: '../demo/08directive-import.html',
			}
		}
	}
	
	var demo_10 = {
		name: "demoHome.10directive-inquiry",
		url: "/10directive-inquiry",
		views: {
			"content@": {
				templateUrl: '../demo/10directive-inquiry.html',
			}
		}
	}
	var demo_11 = {
		name: "demoHome.11directive-process",
		url: "/11directive-process",
		views: {
			"content@": {
				templateUrl: '../demo/11directive-process.html',
			}
		}
	}
	var demo_12 = {
		name: "demoHome.12directive-range",
		url: "/12directive-range",
		views: {
			"content@": {
				templateUrl: '../demo/12directive-range.html',
			}
		}
	}
	var demo_21 = {
		name: "demoHome.21create-master-data",
		url: "/21create-master-data",
		views: {
			"content@": {
				templateUrl: '../demo/21create-master-data.html',
                controller: 'createDepartmentController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/21create-master-data.js');
			}]
		}
	}
	var demo_22 = {
		name: "demoHome.22view-master-data",
		url: "/22view-master-data",
		views: {
			"content@": {
				templateUrl: '../demo/22view-master-data.html',
                controller: 'viewDepartmentController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/22view-master-data.js');
			}]
		}
	}
	var demo_23 = {
		name: "demoHome.23amend-master-data",
		url: "/23amend-master-data",
		views: {
			"content@": {
				templateUrl: '../demo/23amend-master-data.html',
                controller: 'amendDepartmentController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/23amend-master-data.js');
			}]
		}
	}
	var demo_24 = {
		name: "demoHome.24delete-master-data",
		url: "/24delete-master-data",
		views: {
			"content@": {
				templateUrl: '../demo/24delete-master-data.html',
                controller: 'deleteDepartmentController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/24delete-master-data.js');
			}]
		}
	}
	var demo_25 = {
		name: "demoHome.25display-inline-message",
		url: "/25display-inline-message",
		views: {
			"content@": {
				templateUrl: '../demo/25display-inline-message.html',
                controller: 'displayMessageController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/25display-inline-message.js');
			}]
		}
	}
	var demo_26 = {
		name: "demoHome.26reusable-screen",
		url: "/26reusable-screen",
		views: {
			"content@": {
				templateUrl: '../demo/26reusable-screen.html',
                controller: 'reuseController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/26reusable-screen.js');
			}]
		}
	}
	var demo_30 = {
		name: "demoHome.31range-selection",
		url: "/31range-selection",
		views: {
			"content@": {
				templateUrl: '../demo/31range-selection.html',
                controller: 'rangeController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/31range-selection.js');
			}]
		}
	}
	var demo_41 = {
		name: "demoHome.41create-staff-profile",
		url: "/41create-staff-profile",
		views: {
			"content@": {
				templateUrl: '../demo/41create-staff-profile.html',
                controller: 'staffProfileCreateController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/41create-staff-profile.js');
			}]
		}
	}
	var demo_43 = {
		name: "demoHome.43amend-staff-profile",
		url: "/43amend-staff-profile",
		views: {
			"content@": {
				templateUrl: '../demo/43amend-staff-profile.html',
                controller: 'staffProfileAmendController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/43amend-staff-profile.js');
			}]
		}
	}
	$stateProvider.state(homeState);
	$stateProvider.state(spec_01);
	$stateProvider.state(spec_02);
	$stateProvider.state(demo_00);
	$stateProvider.state(demo_01);
	$stateProvider.state(demo_02);
	$stateProvider.state(demo_03);
	$stateProvider.state(demo_04);
	$stateProvider.state(demo_05);
	$stateProvider.state(demo_06);
	$stateProvider.state(demo_07);
	$stateProvider.state(demo_08);
	$stateProvider.state(demo_10);
	$stateProvider.state(demo_11);
	$stateProvider.state(demo_12);
	$stateProvider.state(demo_21);
	$stateProvider.state(demo_22);
	$stateProvider.state(demo_23);
	$stateProvider.state(demo_24);
	$stateProvider.state(demo_25);
	$stateProvider.state(demo_26);
	$stateProvider.state(demo_30);
	$stateProvider.state(demo_41);
	$stateProvider.state(demo_43);

}]);