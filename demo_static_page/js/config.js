// JavaScript Document
// both are not include '/' at the end
var serverHost = "http://172.20.2.60/Develop";
var webRoot = "http://172.20.2.60/Develop";

var requireLoginPage = "login.html";
var afterLoginPage = "demo";

var theme = "B";
// D = Default
// B = Bootstrap
// U = Uikit
// W = w3c
// J = jQueryUI

var dataServer = "php";
// php = PHP <--> MySQL
// mongo = PHP <--> MongoDB

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
	uiThemeTemplate: 'theme/',
}