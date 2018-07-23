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
//'$ocLazyLoadProvider',
//
//'$urlRouterProvider',
//'$stateProvider',

function(config, $httpProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
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
//    app.controller = $controllerProvider.register;
//    app.directive = $compileProvider.directive;
//    app.filter = $filterProvider.register;
//    app.factory = $provide.factory;
//    app.service = $provide.service;
//    app.constant = $provide.constant;
//    app.value = $provide.value;
    // this is important - End
    
    // third-party routing and loading controller before render the template
    /**
     * for more details please study 
     * https://oclazyload.readme.io/docs/with-your-router
     * http://www.funnyant.com/angularjs-ui-router/
     * https://github.com/ocombe/ocLazyLoad/issues/182
     */
//    $urlRouterProvider
//    // redirect
//    // .when('/legacy-route', {
//    //  redirectTo: '/'
//    // })
//    .otherwise('/demoHome');

//    var templateState = {
//        name: "demoHome.pageName",
//        url: "/urlName", // root route
//        views: {
//            "content": {
//                templateUrl: 'templates.html',
//                controller: 'templateCtrl'
//            },
//            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
//                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
//                  // you can lazy load files for an existing module
//                         return $ocLazyLoad.load('js/AppCtrl.js');
//                }]
//            }
//        }
//    }
//
//    var homeState = {
//        name: "demoHome",
//        url: "/demoHome", // root route
//        views: {
//            "navmenu":{
//                templateUrl: '../demo_ui_router/navigation-menu.html',
//            },
//            "content": {
//                templateUrl: '../demo/home.html',
//            }
//        },
//        // resolve: {
//        //  loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
//        //      return $ocLazyLoad.load('./js/demo.js');
//        //  }]
//        // }
//    }
//    var demo_00 = {
//        name: "demoHome.00login-logout",
//        url: "/00login-logout",
//        views: {
//            "content@": {
//                templateUrl: '../demo/00login-logout.html',
//            }
//        }
//    }
//    var demo_01 = {
//        name: "demoHome.01directive-entry",
//        url: "/01directive-entry",
//        views: {
//            "content@": {
//                templateUrl: '../demo/01directive-entry.html',
//            }
//        }
//    }
//    var demo_02 = {
//        name: "demoHome.02directive-pageview",
//        url: "/02directive-pageview",
//        views: {
//            "content@": {
//                templateUrl: '../demo/02directive-pageview.html',
//            }
//        }
//    }
//    var demo_03 = {
//        name: "demoHome.03directive-screen",
//        url: "/03directive-screen",
//        views: {
//            "content@": {
//                templateUrl: '../demo/03directive-screen.html',
//            }
//        }
//    }
//    var demo_04 = {
//        name: "demoHome.04directive-editbox",
//        url: "/04directive-editbox",
//        views: {
//            "content@": {
//                templateUrl: '../demo/04directive-editbox.html',
//            }
//        }
//    }
//    var demo_05 = {
//        name: "demoHome.05directive-message",
//        url: "/05directive-message",
//        views: {
//            "content@": {
//                templateUrl: '../demo/05directive-message.html',
//            }
//        }
//    }
//    var demo_06 = {
//        name: "demoHome.06directive-export",
//        url: "/06directive-export",
//        views: {
//            "content@": {
//                templateUrl: '../demo/06directive-export.html',
//            }
//        }
//    }
//    var demo_07 = {
//        name: "demoHome.07directive-upload",
//        url: "/07directive-upload",
//        views: {
//            "content@": {
//                templateUrl: '../demo/07directive-upload.html',
//            }
//        }
//    }
//    var demo_08 = {
//        name: "demoHome.08directive-import",
//        url: "/08directive-import",
//        views: {
//            "content@": {
//                templateUrl: '../demo/08directive-import.html',
//            }
//        }
//    }
//    var demo_09 = {
//        name: "demoHome.09directive-process",
//        url: "/09directive-process",
//        views: {
//            "content@": {
//                templateUrl: '../demo/09directive-process.html',
//            }
//        }
//    }
//    var demo_10 = {
//        name: "demoHome.10directive-range",
//        url: "/10directive-range",
//        views: {
//            "content@": {
//                templateUrl: '../demo/10directive-range.html',
//            }
//        }
//    }
//    var demo_11 = {
//        name: "demoHome.11create-master-data",
//        url: "/11create-master-data",
//        views: {
//            "content@": {
//                templateUrl: '../demo/11create-master-data.html',
//                controller: 'createDepartmentController'
//            }
//        },
//        resolve: {
//            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
//                return $ocLazyLoad.load('./js/controller/11create-master-data.js');
//            }]
//        }
//    }
//    var demo_12 = {
//        name: "demoHome.12view-master-data",
//        url: "/12view-master-data",
//        views: {
//            "content@": {
//                templateUrl: '../demo/12view-master-data.html',
//                controller: 'viewDepartmentController'
//            }
//        },
//        resolve: {
//            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
//                return $ocLazyLoad.load('./js/controller/12view-master-data.js');
//            }]
//        }
//    }
//    var demo_13 = {
//        name: "demoHome.13amend-master-data",
//        url: "/13amend-master-data",
//        views: {
//            "content@": {
//                templateUrl: '../demo/13amend-master-data.html',
//                controller: 'amendDepartmentController'
//            }
//        },
//        resolve: {
//            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
//                return $ocLazyLoad.load('./js/controller/13amend-master-data.js');
//            }]
//        }
//    }
//    var demo_14 = {
//        name: "demoHome.14delete-master-data",
//        url: "/14delete-master-data",
//        views: {
//            "content@": {
//                templateUrl: '../demo/14delete-master-data.html',
//                controller: 'deleteDepartmentController'
//            }
//        },
//        resolve: {
//            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
//                return $ocLazyLoad.load('./js/controller/14delete-master-data.js');
//            }]
//        }
//    }
//    var demo_15 = {
//        name: "demoHome.15display-inline-message",
//        url: "/15display-inline-message",
//        views: {
//            "content@": {
//                templateUrl: '../demo/15display-inline-message.html',
//                controller: 'displayMessageController'
//            }
//        },
//        resolve: {
//            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
//                return $ocLazyLoad.load('./js/controller/15display-inline-message.js');
//            }]
//        }
//    }
//    var demo_16 = {
//        name: "demoHome.16reusable-screen",
//        url: "/16reusable-screen",
//        views: {
//            "content@": {
//                templateUrl: '../demo/16reusable-screen.html',
//                controller: 'reuseController'
//            }
//        },
//        resolve: {
//            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
//                return $ocLazyLoad.load('./js/controller/16reusable-screen.js');
//            }]
//        }
//    }
//    var demo_20 = {
//        name: "demoHome.20range-selection",
//        url: "/20range-selection",
//        views: {
//            "content@": {
//                templateUrl: '../demo/20range-selection.html',
//                controller: 'rangeController'
//            }
//        },
//        resolve: {
//            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
//                return $ocLazyLoad.load('./js/controller/20range-selection.js');
//            }]
//        }
//    }
//    var demo_21 = {
//        name: "demoHome.21create-staff-profile",
//        url: "/21create-staff-profile",
//        views: {
//            "content@": {
//                templateUrl: '../demo/21create-staff-profile.html',
//                controller: 'staffProfileCreateController'
//            }
//        },
//        resolve: {
//            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
//                return $ocLazyLoad.load('./js/controller/21create-staff-profile.js');
//            }]
//        }
//    }
//    var demo_23 = {
//        name: "demoHome.23amend-staff-profile",
//        url: "/23amend-staff-profile",
//        views: {
//            "content@": {
//                templateUrl: '../demo/23amend-staff-profile.html',
//                controller: 'staffProfileAmendController'
//            }
//        },
//        resolve: {
//            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
//                return $ocLazyLoad.load('./js/controller/23amend-staff-profile.js');
//            }]
//        }
//    }
//    $stateProvider.state(homeState);
//    $stateProvider.state(demo_00);
//    $stateProvider.state(demo_01);
//    $stateProvider.state(demo_02);
//    $stateProvider.state(demo_03);
//    $stateProvider.state(demo_04);
//    $stateProvider.state(demo_05);
//    $stateProvider.state(demo_06);
//    $stateProvider.state(demo_07);
//    $stateProvider.state(demo_08);
//    $stateProvider.state(demo_09);
//    $stateProvider.state(demo_10);
//    $stateProvider.state(demo_11);
//    $stateProvider.state(demo_12);
//    $stateProvider.state(demo_13);
//    $stateProvider.state(demo_14);
//    $stateProvider.state(demo_15);
//    $stateProvider.state(demo_16);
//    $stateProvider.state(demo_20);
//    $stateProvider.state(demo_21);
//    $stateProvider.state(demo_23);

}]);