// JavaScript Document
"use strict";
// jQuery conflict with native prototype.
/*
String.prototype.IsNullOrEmpty = function(){
	var curStr = this;
	var isNullOrEmpty = false;
	if(typeof(curStr) == "undefined")
		isNullOrEmpty = true;
	else if(curStr == null)
		isNullOrEmpty = true;
	else if(curStr == "")
		isNullOrEmpty = true;
	return isNullOrEmpty;
}

Object.prototype.IsEmpty = function(){
	var obj = this;
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop))
			return false;
	}

	return true;
}
*/

// fixed: http://stackoverflow.com/questions/32169408/userscript-issue-with-object-prototype
// String.defineProperty(String.prototype, 'IsNullOrEmpty', {
//   value : function() {
// 	  	var curStr = this;
// 		var isNullOrEmpty = false;
// 		if(typeof(curStr) == "undefined")
// 			isNullOrEmpty = true;
// 		else if(curStr == null)
// 			isNullOrEmpty = true;
// 		else if(curStr == "")
// 			isNullOrEmpty = true;
// 		return isNullOrEmpty;
// 	},
//   enumerable : false
// });

Object.defineProperty(Object.prototype, 'IsEmptyObject', {
  value : function() {
		var obj = this;
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				return false;
		}
	
		return true;
	},
  enumerable : false
});
String.prototype.IsNullOrEmpty = function(){
	  	var curStr = this;
		var isNullOrEmpty = false;
		if(typeof(curStr) == "undefined")
			isNullOrEmpty = true;
		else if(curStr == null)
			isNullOrEmpty = true;
		else if(curStr == "")
			isNullOrEmpty = true;
		return isNullOrEmpty;
}
String.prototype.ReplaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function getFunctionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

//angular.element() === jQuery() === $();
// using the angular ui of Bootstrap
var app = angular.module('myApp', ['ngCookies', 'ui.bootstrap']);

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
	
	$rootScope.serverHost = "http://192.168.0.190/Develop"; //
	$rootScope.webRoot = "http://192.168.0.190/Develop"; // Describe the domain of the website, not recommend to use localhost, because of the chrome donesn't set cookies for localhost domain.

	$rootScope.webRoot += "/";	
	$rootScope.requireLoginPage = $rootScope.webRoot+"login.html"; // Specify the page to be redirect after logout success
	$rootScope.afterLoginPage = $rootScope.webRoot+"main-menu.html"; // Specify the page to be redirect after login success
	
	$rootScope.controller = $rootScope.webRoot+"controller/";
	$rootScope.templateFolder = $rootScope.webRoot+"Templates/";
	$rootScope.screenTemplate = $rootScope.templateFolder+"screen/";
});

app.service('Core', ['$rootScope', function($rootScope){
	var core = this;
	core.ConvertMySQLDataType = function(mySqlDataType){
        var dataType ="string";
        if(mySqlDataType == "varchar" || 
            mySqlDataType == "char" || 
            mySqlDataType == "tinytext" || 
            mySqlDataType == "text" || 
            mySqlDataType == "mediumtext" || 
            mySqlDataType == "longtext"){
            dataType = "string";
        }
        else if (mySqlDataType == "datetime" ||
            mySqlDataType == "timestamp"  ||
            mySqlDataType == "date" ){
            dataType = "date";
        }
        else if (mySqlDataType == "double" ||
            mySqlDataType == "decimal"  ||
            mySqlDataType == "float"  ||
            mySqlDataType == "tinyint"  ||
            mySqlDataType == "smallint"  ||
            mySqlDataType == "mediumint"  ||
            mySqlDataType == "int"  ||
            mySqlDataType == "bigint" ){
            dataType = "double";
        }
        return dataType;
	}
	return core;
}]);

app.service('LockManager', ['$rootScope', '$timeout', function($rootScope, $cookies){
	var locker = this;
	locker.lockArea = {};
	locker.tagName = "";
	locker.programId = "";

	locker.LockAllControls = function(lockArea, tagName){
		// var lockArea = locker.lockArea;
		// var tagName = locker.tagName;
		// tagName = tagName.toLowerCase();

		var isLockArea = CheckLockArea(lockArea);
		if(!isLockArea)
			return;

		console.log("LockAllControls(): "+tagName);

		if(tagName == "entry")
		{
			LockEntryControls(lockArea, true);
		}
		else
		{
			LockPageViewControls(lockArea, true);
		}
	}

	locker.LockAllInputBox = function(lockArea, tagName){
		tagName = tagName.toLowerCase();
		LockAllInputBox(lockArea, true);
	}

	locker.UnLockSubmitButton = function(lockArea, tagName){
		tagName = tagName.toLowerCase();
		LockSubmitButton(lockArea, false);
	}

	locker.UnLockAllControls = function(lockArea, tagName){
		// var lockArea = locker.lockArea;
		// var tagName = locker.tagName;

		var isLockArea = CheckLockArea(lockArea);
		if(!isLockArea)
			return;

		console.log("UnLockAllControls(): "+tagName);

		if(tagName == "entry")
		{
			LockEntryControls(lockArea, false);
		}
		else
		{
			LockPageViewControls(lockArea, false);
		}
	}

	function CheckLockArea(lockArea){
		var isValid = true;
		if(!lockArea){
			console.log("LockManager: lock area have not defined. Avoid to UnLockAllControls().")
			isValid = false;
		}
		return isValid;
	}

	function LockPageViewControls(lockArea, isLock){
		var fieldset = lockArea.find("fieldset")
		$(fieldset).prop("disabled", isLock)
		
		var input = lockArea.find("input")
		$(input).prop("disabled", isLock)
	    
	    var textarea = lockArea.find("textarea")
	    $(textarea).prop("disabled", isLock)

		var button = lockArea.find("button")
		$(button).prop("disabled", isLock)
	}

	function LockEntryControls(lockArea, isLock){
		var fieldset = lockArea.find("fieldset")
		$(fieldset).prop("disabled", isLock)
		
		var input = lockArea.find("input")
		$(input).prop("disabled", isLock)

		var textarea = lockArea.find("textarea")
		$(textarea).prop("disabled", isLock)

		// var nonSubmitButton = lockArea.find("button:not([type='submit'])")
		var nonSubmitButton = lockArea.find("button[type='submit']")
		nonSubmitButton.prop("disabled", isLock)

		// var button = lockArea.find(".submitBtn button")
		// $(button).prop("disabled", isLock)

		var editBtn = lockArea.find("editbox button")
		$(editBtn).prop("disabled", isLock)
	}

	function LockAllInputBox(lockArea, isLock){
		var fieldset = lockArea.find("fieldset")
		$(fieldset).prop("disabled", isLock)
		
		var input = lockArea.find("input")
		$(input).prop("disabled", isLock)
	    
	    var textarea = lockArea.find("textarea")
	    $(textarea).prop("disabled", isLock)
	}

	function LockSubmitButton(lockArea, isLock){
		var button = lockArea.find(".submitBtn button")
		$(button).prop("disabled", isLock)
	}

	return locker;
}]);

app.service('Security', function($rootScope, $cookies) {
	var secure = this;
	var rootScope = $rootScope;
   
	secure.IsSessionExists = function(){
		var sessionID = secure.GetSessionID();
		var isExists = false;
		if(typeof (sessionID) == "undefined"){
			isExists = false;
		}else if(sessionID == null){
			isExists = false;
		}else if(sessionID == ""){
			
		}else{
			isExists = true;
		}
		
		return isExists;
	}
	
	secure.GetSessionID = function(){
        var sessionID = $cookies.get("SessionID");
        return sessionID;
	}

	/**
	 *return object {
	 *	CompanyCode - string, 
	 *	UserCode - string, login id
	 *	Password - string, login password
	 *	StaffID - string, staff id without @staff@
	 *}
	*/
	secure.GetLoginData = function(){
        var loginDataString = $cookies.get("LoginData");
        var loginObj = {};
        if(typeof(loginDataString) != "undefined"){
	        if(!loginDataString.IsNullOrEmpty()){
	        	loginObj = JSON.parse(loginDataString);
	        }
        }
        return loginObj;
	}
	
	// redirect a page require user login
	secure.RedirectToLoginPage = function(){
	   window.location = rootScope.requireLoginPage;
	}
	
	// redirect to a page after the user login
	secure.RedirectToMainPage = function(){
	   window.location = rootScope.afterLoginPage;
	}
	
	secure.GoToMenuIfSessionExists = function(){
	   var isUserLogin = true;
	   isUserLogin = secure.IsSessionExists();
	   if(isUserLogin){
		   secure.RedirectToMainPage();
	   }else{
		   
	   }
	}
	
	secure.RequiresAuthorization = function(){
	   var isUserLogin = true;
	   isUserLogin = secure.IsSessionExists();
	   if(isUserLogin){
	   }else{
		   secure.RedirectToLoginPage();
	   }
	}

	secure.SuccessButUnexpected = function(jqXHR, textStatus, errorThrown){
		// console.warn("Server response status:200 but response unexpected");
		console.log("textStatus: " + textStatus);
		console.log(jqXHR);
		console.log(errorThrown);
	}

	secure.ServerResponse499 = function(jqXHR, textStatus, errorThrown){
		console.log("Server response status:499");
		console.log("Require login again");

		var gotoLoginAgain = confirm("Server Session timeout, leave this page to login again.");

		if(gotoLoginAgain){
			secure.ClearSessionNUserData();
			secure.RedirectToLoginPage();
		}
	}

	secure.ServerResponseInFail = function(jqXHR, textStatus, errorThrown){
		console.warn("jqxhr.fail, recevied (jqXHR, textStatus, errorThrown)")
		console.log("textStatus: " + textStatus);
		console.log(jqXHR);
		console.log(errorThrown);

		if(jqXHR.status == 499){
			secure.ServerResponse499(jqXHR, textStatus, errorThrown);
		}else if(jqXHR.responseText === ""){
			console.log("HTTP responseText is empty!")
			// Security.ServerResponse499(jqXHR, textStatus, errorThrown);
		}
	}

	/**
	 * @param {Object} loginDataObj - {"UserCode":"...","Password":"...","CompanyCode":"..."}
	 */
	secure.LoginNRedirect = function(loginDataObj, scope){
		var url = $rootScope.serverHost;
		var submitData = loginDataObj;
		submitData.UserCode.toLowerCase();
		submitData.CompanyCode.toUpperCase();

		submitData.Action = "Login";

  			var jqxhr = $.ajax({
  				type: 'POST',
  				url: url+'/model/ConnectionManager.php',
  				data: JSON.stringify(submitData),
  				dataType: "json", // [xml, json, script, or html]
  			});
  			jqxhr.done(function (data, textStatus, jqXHR) {

  			});
  			jqxhr.fail(function (jqXHR, textStatus, errorThrown) {

  			});
  			jqxhr.always(function (data_or_JqXHR, textStatus, jqXHR_or_errorThrown) {
  				// console.log("jqxhr.always, recevied (data_or_JqXHR, textStatus, jqXHR_or_errorThrown)")
  				scope.LoginResult(data_or_JqXHR, textStatus, jqXHR_or_errorThrown);
  				
  				if(textStatus == "success"){
	  				var gData = data_or_JqXHR;
	  				if(gData.Status = "success"){
						$cookies.put("SessionID", gData.SessionID);
						submitData.StaffID = submitData.UserCode.ReplaceAll("@staff@", "");
						submitData.StaffID = submitData.StaffID.toUpperCase();
						$cookies.put("LoginData", JSON.stringify(submitData));
			        }
			        
		  			secure.SetTimeout();
		  			if(gData.Status = "success")
						alert("login success");
		  			secure.RedirectToMainPage();
  				}

  			});
	}

	secure.SetTimeout = function(){
		var url = $rootScope.serverHost;
		var submitData = {"timeout": 3000000};

		var jqxhr = $.ajax({
			type: 'POST',
			url: url+'/SETTIMEOUT',
			data: JSON.stringify(submitData),
			dataType: "json", // [xml, json, script, or html]
		});

		jqxhr.done(function (data, textStatus, jqXHR) {
		});
		jqxhr.always(function (data_or_JqXHR, textStatus, jqXHR_or_errorThrown) {
			//secure.RedirectToMainPage();
		});
	}

	secure.LogoutNRedirect = function(){
		var url = $rootScope.serverHost;
		var isSessionExists = secure.IsSessionExists();
		if(!isSessionExists){
			secure.ClearSessionNUserData();
			secure.RedirectToLoginPage();
			return;
		}
		
		var clientID = secure.GetSessionID();
		
		var submitData = {"Session": clientID};
		submitData.Action = "Logout";

		var jqxhr = $.ajax({
		  type: 'POST',
		  url: url+'/model/ConnectionManager.php',
		  data: JSON.stringify(submitData),
		  //dataType: "json", // [xml, json, script, or html]
		  dataType: "html",
		});
		jqxhr.done(function (data, textStatus, jqXHR) {
			alert("logout success");
			secure.ClearSessionNUserData();
			secure.RedirectToLoginPage();
		});
		jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
		  console.log("jqxhr.fail, recevied (jqXHR, textStatus, errorThrown)")
		  console.log("textStatus: " + textStatus);
		  console.log(jqXHR);
		  console.log(errorThrown);
	
		});
		jqxhr.always(function (data_or_JqXHR, textStatus, jqXHR_or_errorThrown) {
		});
	}

	secure.ClearSessionNUserData = function(){
		$cookies.remove("SessionID");
		$cookies.remove("LoginData");
		return true;
	}

	secure.IsSystemField = function(fieldName){

        var isSystemField = false;

        switch (fieldName)
        {
            // skill these colummn
            case "Line":
            case "UserAccessGroups":
            case "UserGroups":
            case "Used":
            case "SysLastUpdateUser":
            case "SysLastUpdateDate":
            case "SysLastUpdatePgm":
            case "CreateDate":
            case "CreateUser":
            case "LastUpdateUser":
            case "LastUpdateDate":
                isSystemField = true;
                break;
        }

        return isSystemField;
	}
});

/*
// Directive Template
app.directive('editbox', ['Security', '$rootScope', function(Security, $rootScope, $cookies) {
    function EditboxConstructor($scope, $element, $attrs) {
    	function Initialize() {
    	}
    	Initialize();
    }
    function templateFunction(tElement, tAttrs) {
    }

	return {
		require: ['ngModel'],
		restrict: 'EA', //'EA', //Default in 1.3+
		transclude: true,

		// scope: [false | true | {...}]
		// false = use parent scope
		// true =  A new child scope that prototypically inherits from its parent
		// {} = create a isolate scope
		scope: true,

		controller: EditboxConstructor,
		controllerAs: 'editboxCtrl',

		//If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
		bindToController: {
			ngModel: '=',
			// editMode: '=?',
			// programId: '=',
			// EventListener: '=',
			// SubmitData: '=',
			// DisplayCustomData: '=',
			// DisplaySubmitDataResultMessage: '=',
		},
		template: templateFunction,
		compile: function compile(tElement, tAttrs, transclude) {
		    return {
		        pre: function preLink(scope, iElement, iAttrs, controller) {
					// var globalCriteria = $rootScope.globalCriteria;

					// if(scope.editMode == globalCriteria.editMode.None || 
					// 	scope.editMode == globalCriteria.editMode.View || 
					// 	scope.editMode == globalCriteria.editMode.Null
					// ){
					// 	iElement.find("input").each(function(index, element){
					// 		//$(element).prop("readonly", true)
					// 		$(this).prop("readonly", true)
					// 	})
					// }

		            function EventListener(){
		            	console.log("scope.$id:"+scope.$id+", must implement $scope.EventListener() function in webapge");
		            }

		            //process flow
		            if(typeof scope.EventListener == "function"){
		            	scope.EventListener(scope, iElement, iAttrs, controller);
		            }else{
		            	EventListener();
		            }
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        }
		    }
		},
	};
}]);
*/