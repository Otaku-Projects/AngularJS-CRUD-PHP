// JavaScript Document
// both are not include '/' at the end
var serverHost = "http://192.168.0.190/Develop";
var webRoot = "http://192.168.0.190/Develop";

var requireLoginPage = "login.html";
var afterLoginPage = "main-menu.html";

var CookiesEffectivePath = '/';

var directiveEditMode = {
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
	
	Copy: 15
}
var reservedPath = {
	controller: 'controller/',
	templateFolder: 'Templates/',
	screenTemplate: 'screen/',
}

app.constant('config', {
	serverHost: serverHost,
	webRoot: webRoot,
	requireLoginPage: requireLoginPage,
	afterLoginPage: afterLoginPage,
	
	editMode: directiveEditMode,
	reservedPath: reservedPath,
	CookiesEffectivePath: CookiesEffectivePath,
});

app.config(['config', '$httpProvider', function(config, $httpProvider) {
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

/*
app.run(function ($rootScope, $log, $cookies) {
	$rootScope.globalCriteria = {};
	
	var host = window.location.hostname;
	var href = window.location.href;
	
	var globalCriteria = {};
	globalCriteria.editMode = {};
	globalCriteria.editMode.None = 0;
	globalCriteria.editMode.Null = 1;

	globalCriteria.editMode.Create = 5;
	globalCriteria.editMode.Amend = 6;
	globalCriteria.editMode.Delete = 7;
	globalCriteria.editMode.View = 8;
	globalCriteria.editMode.AmendAndDelete = 9;

	globalCriteria.editMode.Copy = 15;
	
	$rootScope.globalCriteria = globalCriteria;
	
	$rootScope.serverHost = "http://172.20.2.60/Develop"; //
	$rootScope.webRoot = "http://172.20.2.60/Develop"; // Describe the domain of the website, not recommend to use localhost, because of the chrome donesn't set cookies for localhost domain.

	$rootScope.webRoot += "/";	
	$rootScope.requireLoginPage = $rootScope.webRoot+"login.html"; // Specify the page to be redirect after logout success
	$rootScope.afterLoginPage = $rootScope.webRoot+"main-menu.html"; // Specify the page to be redirect after login success
	
	$rootScope.controller = $rootScope.webRoot+"controller/";
	$rootScope.templateFolder = $rootScope.webRoot+"Templates/";
	$rootScope.screenTemplate = $rootScope.templateFolder+"screen/";
});
*/