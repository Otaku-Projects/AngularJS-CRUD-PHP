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
	.otherwise('/Home');

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
		name: "pageName",
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
		name: "Home",
		url: "/Home", // root route
		views: {
			"navmenu":{
				templateUrl: 'navigation-menu.html',
			},
			"content": {
				templateUrl: 'home.html',
			}
		},
		// resolve: {
		// 	loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
		// 		return $ocLazyLoad.load('./js/demo.js');
		// 	}]
		// }
	}
	var spec_01 = {
		name: "spec01-sys-block-diagram",
		url: "/spec01-sys-block-diagram",
		views: {
			"content@": {
				templateUrl: 'spec01-sys-block-diagram.html',
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
		name: "spec02-client-architecture",
		url: "/spec02-client-architecture",
		views: {
			"content@": {
				templateUrl: 'spec02-client-architecture.html',
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
		name: "00login-logout",
		url: "/00login-logout",
		views: {
			"content@": {
				templateUrl: '00login-logout.html',
			}
		}
	}
	
	var demo_21 = {
		name: "21entry-create-master-data",
		url: "/21entry-create-master-data",
		views: {
			"content@": {
				templateUrl: '21entry-create-master-data.html',
                controller: 'createDepartmentController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/21entry-create-master-data.js');
			}]
		}
	}
	var demo_22 = {
		name: "22pageview-view-master-data",
		url: "/22pageview-view-master-data",
		views: {
			"content@": {
				templateUrl: '22pageview-view-master-data.html',
                controller: 'viewDepartmentController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/22pageview-view-master-data.js');
			}]
		}
	}
	var demo_23 = {
		name: "23reusable-screen",
		url: "/23reusable-screen",
		views: {
			"content@": {
				templateUrl: '23reusable-screen.html',
                controller: 'reuseController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/23reusable-screen.js');
			}]
		}
	}
	var demo_24 = {
		name: "24editbox",
		url: "/24editbox",
		views: {
			"content@": {
				templateUrl: '24editbox.html',
                controller: 'editboxController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/24editbox.js');
			}]
		}
	}
	
	
	var demo_25 = {
		name: "25data-export",
		url: "/25data-export",
		views: {
			"content@": {
				templateUrl: '25data-export.html',
                controller: 'exportController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/25data-export.js');
			}]
		}
	}
	var demo_26 = {
		name: "26data-upload",
		url: "/26data-upload",
		views: {
			"content@": {
				templateUrl: '26data-upload.html',
                controller: 'uploadController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/26data-upload.js');
			}]
		}
	}
	var demo_27 = {
		name: "27data-import",
		url: "/27data-import",
		views: {
			"content@": {
				templateUrl: '27data-import.html',
                controller: 'importController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/27data-import.js');
			}]
		}
	}
	var demo_28 = {
		name: "28display-inline-message",
		url: "/28display-inline-message",
		views: {
			"content@": {
				templateUrl: '28display-inline-message.html',
                controller: 'displayMessageController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/28display-inline-message.js');
			}]
		}
	}
	var demo_29 = {
		name: "29range-selection",
		url: "/29range-selection",
		views: {
			"content@": {
				templateUrl: '29range-selection.html',
                controller: 'rangeController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/29range-selection.js');
			}]
		}
	}
	var demo_30 = {
		name: "30data-inquiry",
		url: "/30data-inquiry",
		views: {
			"content@": {
				templateUrl: '30data-inquiry.html',
                controller: 'inquiryController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/30data-inquiry.js');
			}]
		}
	}
	var demo_31 = {
		name: "31data-process",
		url: "/31data-process",
		views: {
			"content@": {
				templateUrl: '31data-process.html',
                controller: 'processController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/31data-process.js');
			}]
		}
	}
	
	var demo_41 = {
		name: "41list-and-view-master-data",
		url: "/41list-and-view-master-data",
		views: {
			"content@": {
				templateUrl: '41list-and-view-master-data.html',
                controller: 'viewDepartmentController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/41list-and-view-master-data.js');
			}]
		}
	}
	var demo_42 = {
		name: "42list-and-amend-master-data",
		url: "/42list-and-amend-master-data",
		views: {
			"content@": {
				templateUrl: '42list-and-amend-master-data.html',
                controller: 'amendDepartmentController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/42list-and-amend-master-data.js');
			}]
		}
	}
	var demo_43 = {
		name: "43list-and-delete-master-data",
		url: "/43list-and-delete-master-data",
		views: {
			"content@": {
				templateUrl: '43list-and-delete-master-data.html',
                controller: 'deleteDepartmentController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/43list-and-delete-master-data.js');
			}]
		}
	}
	var demo_44 = {
		name: "44create-staff-profile",
		url: "/44create-staff-profile",
		views: {
			"content@": {
				templateUrl: '44create-staff-profile.html',
                controller: 'staffProfileCreateController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/44create-staff-profile.js');
			}]
		}
	}
	var demo_45 = {
		name: "46list-and-view-staff-profile",
		url: "/46list-and-view-staff-profile",
		views: {
			"content@": {
				templateUrl: '46list-and-view-staff-profile.html',
                controller: 'staffProfileViewController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/46list-and-view-staff-profile.js');
			}]
		}
	}
	var demo_46 = {
		name: "46list-and-amend-staff-profile",
		url: "/46list-and-amend-staff-profile",
		views: {
			"content@": {
				templateUrl: '46list-and-amend-staff-profile.html',
                controller: 'staffProfileAmendController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/46list-and-amend-staff-profile.js');
			}]
		}
	}
	var demo_47 = {
		name: "47list-and-delete-staff-profile",
		url: "/47list-and-delete-staff-profile",
		views: {
			"content@": {
				templateUrl: '47list-and-delete-staff-profile.html',
                controller: 'staffProfileDeleteController'
			}
		},
		resolve: {
			loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load('./js/controller/47list-and-delete-staff-profile.js');
			}]
		}
	}
	$stateProvider.state(homeState);
	$stateProvider.state(spec_01);
	$stateProvider.state(spec_02);
	$stateProvider.state(demo_00);
	
	$stateProvider.state(demo_21);
	$stateProvider.state(demo_22);
	$stateProvider.state(demo_23);
	$stateProvider.state(demo_24);
	$stateProvider.state(demo_25);
	$stateProvider.state(demo_26);
	$stateProvider.state(demo_27);
	$stateProvider.state(demo_28);
	$stateProvider.state(demo_29);
	$stateProvider.state(demo_30);
	$stateProvider.state(demo_31);
	
	$stateProvider.state(demo_41);
	$stateProvider.state(demo_42);
	$stateProvider.state(demo_43);
	$stateProvider.state(demo_44);
	//$stateProvider.state(demo_45);
	$stateProvider.state(demo_46);

}]);