// JavaScript Document
"use strict";

//angular.element() === jQuery() === $();
// using the angular ui of Bootstrap
var app = angular.module('myApp', ['ngCookies', 'ngFileUpload', 'ui.router', "oc.lazyLoad"]);


app.constant('config', {
	serverHost: serverHost,
	webRoot: webRoot,
	requireLoginPage: requireLoginPage,
	afterLoginPage: afterLoginPage,
	dataServer: dataServer,
	
	uiTheme: theme,
	
	editMode: directiveEditMode,
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

app.service('Core', ['$rootScope', 'config', 'SysMessageManager', function($rootScope, config, SysMessageManager){
	var core = this;
	core.SysLog = SysMessageManager;
	core.SysMsg = SysMessageManager;
	core.RegistryConfig = function(){
		$rootScope.globalCriteria = {};
		
		$rootScope.globalCriteria.editMode = config.editMode;
		
		$rootScope.serverHost = config.serverHost;
		$rootScope.webRoot = config.webRoot;
		
		$rootScope.webRoot += "/";	
		$rootScope.requireLoginPage = $rootScope.webRoot+config.requireLoginPage;
		$rootScope.afterLoginPage = $rootScope.webRoot+config.afterLoginPage;
		
		$rootScope.uiTheme = config.uiTheme.toUpperCase();
		
		$rootScope.controller = $rootScope.webRoot+config.reservedPath.controller;
		$rootScope.templateFolder = $rootScope.webRoot+config.reservedPath.templateFolder;
		$rootScope.screenTemplate = $rootScope.templateFolder+config.reservedPath.screenTemplate;
		$rootScope.uiThemeFolder = $rootScope.templateFolder+config.reservedPath.uiThemeTemplate;
		
		$rootScope.CookiesEffectivePath = config.CookiesEffectivePath;

		// Server Environment
		$rootScope.serEnv = {};
		$rootScope.serEnv.phpRecordLimit = 10; // assume PHP select reocrd limit as 10, must match with server side
	}
	core.GetConfig = function(){
		return config;
	}
	
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
	core.IsSystemField = function(fieldName){

        var isSystemField = false;

        switch (fieldName)
        {
            // skill these colummn
            case "line":
            case "systemUpdateDate":
            case "systemUpdateUser":
            case "systemUpdateProgram":
            case "createDate":
            case "createUser":
            case "lastUpdateUser":
            // case "lastUpdateDate":
                isSystemField = true;
                break;
        }

        return isSystemField;
	}
	core.IsMySQLServer = function(){
		var isMySQLServer = false;
		if(config.dataServer == "php")
			isMySQLServer = true;
		return isMySQLServer;
	}
	
	core.RegistryConfig();
	return core;
}]);

app.service('ThemeService', ['$rootScope', 'config', 'TemplateService', function($rootScope, config, TemplateService){
	var theme = this;
	
	theme.GetThemeName = function(){
		var themeCode = config.uiTheme.toUpperCase();
		return GetThemeName(themeCode);
	}
	
	theme.GetTemplateHTML = function(directiveName){
		var templatePath = theme.GetTemplateURL(directiveName);
		
		var request = TemplateService.GetTemplate(templatePath);
		// request.then(function(responseObj) {
  //           var data = responseObj.data;
		// });
		
		return request;
	}
	
	theme.GetTemplateURL = function(directiveName){
		var themeCode = config.uiTheme.toUpperCase();
		var themeName = theme.GetThemeName(themeCode);
		var templateName = directiveName+"-"+themeName+".html";
		var templatePath = $rootScope.uiThemeFolder + themeName + "/" + templateName;
		
		return templatePath;
	}
	
	function GetThemeName(themeCode){
		var themeName = "";
		switch(themeCode){
			case "D":
				themeName = "default";
				break;
			case "B":
				themeName = "bootstrap";
				break;
			case "U":
				themeName = "uikit";
				break;
			case "W":
				themeName = "w3css";
				break;
			case "M":
				themeName = "material_ng";
				break;
			case "J":
				themeName = "jqueryui";
				break;
			case "S":
				themeName = "semantic";
				break;
			default:
				themeName = "default";
				break;
		}
		return themeName;
	}
}]);

app.service('LockManager', ['$rootScope', '$timeout', 'config', function($rootScope, $cookies, config) {
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
		if(config.debugLog.LockControl)
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

		if(config.debugLog.UnlockControl)
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
		var subminButton = lockArea.find("button[type='submit']")
		$(subminButton).prop("disabled", isLock)
	}

	return locker;
}]);

app.service('Security', ['$rootScope', 'Core', 'CookiesManager', 'MessageService', function($rootScope, Core, $jqCookies,  MessageService) {
	var secure = this;
	var rootScope = $rootScope;
   
	secure.IsAlreadyLogin = function(callbackFtn){
		var url = $rootScope.serverHost;
		//var clientID = secure.GetSessionID();
		
		var submitData = {"Session": ""};
		submitData.Action = "CheckLogin";

		var jqxhr = $.ajax({
		  type: 'POST',
		  url: url+'/model/ConnectionManager.php',
		  data: JSON.stringify(submitData),
		  //dataType: "json", // [xml, json, script, or html]
		  dataType: "json",
		});
		jqxhr.done(function (data, textStatus, jqXHR) {
		});
		jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
		});
		jqxhr.always(function (data_or_JqXHR, textStatus, jqXHR_or_errorThrown) {
  			var isUserAlreadyLogin = false;
  			if(textStatus == "success"){
	  			var gData = data_or_JqXHR;
	  			if(data_or_JqXHR.Status == "LoginSuccess" || gData.Status == "OK"){
					isUserAlreadyLogin = true;
			       }
  			}
			callbackFtn && callbackFtn(isUserAlreadyLogin);
		});
	}
	
	secure.GetSessionID = function(){
        var sessionID = $jqCookies.Read("SessionID");
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
        var loginDataString = $jqCookies.Read("LoginData");
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
		secure.IsAlreadyLogin(function(isUserAlreadyLogin){
			if(isUserAlreadyLogin){
				secure.RedirectToMainPage();
			}
		});
	}
	
	secure.RequiresAuthorization = function(){
		secure.IsAlreadyLogin(function(isUserAlreadyLogin){
			if(!isUserAlreadyLogin){
				alert("Session was timeout, please login agian");
				secure.RedirectToLoginPage();
			}
		});
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


	secure.HttpPromiseFail = function(reason){
		console.warn("HttpRequest promise return as fail");
		console.dir(reason);
        MessageService.addMsg(reason);
	}
	secure.HttpPromiseReject = function(reason){
		console.warn("HttpRequest promise reject");
		console.dir(reason);
        MessageService.addMsg(reason);
	}
	secure.HttpPromiseErrorCatch = function(reason){
		console.warn("HttpRequest promise error catch");
		console.dir(reason);
		console.trace();
        MessageService.addMsg(reason);
	}

	/**
	 * @param {Object} loginDataObj - {"UserCode":"...","Password":"...","CompanyCode":"..."}
	 */
	secure.LoginNRedirect = function(loginDataObj, scope){
		var url = $rootScope.serverHost;
		var submitData = loginDataObj;
		submitData.UserCode.toLowerCase();

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
	  				if(gData.Status == "success" || data_or_JqXHR.Status == "LoginSuccess"){
						$jqCookies.Save("SessionID", gData.SESSION_ID);
						submitData.UserCode = submitData.UserCode.toUpperCase();
						$jqCookies.Save("LoginData", JSON.stringify(submitData));
			        }
			        
		  			if(gData.Status == "success" || data_or_JqXHR.Status == "LoginSuccess"){
						alert("login success");
						secure.RedirectToMainPage();
					}
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
		
		secure.IsAlreadyLogin(function(isUserAlreadyLogin){
			if(!isUserAlreadyLogin){
				alert("Session already destroyed.");
				secure.ClearSessionNUserData();
				secure.RedirectToLoginPage();
				return;
			}
		});
		
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
			secure.ClearSessionNUserData();
			alert("logout success");
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
		$jqCookies.Remove("SessionID");
		$jqCookies.Remove("LoginData");
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
}]);

app.service('CookiesManager', function($rootScope, $cookies) {
	var cookies = this;
	var rootScope = $rootScope;
   
	cookies.Save = function(name, value){
		//Define lifetime of the cookie. Value can be a Number which will be interpreted as days from time of creation or a Date object. If omitted, the cookie becomes a session cookie.
		var expiryDay = 1;
		
		//Define the path where the cookie is valid. By default the path of the cookie is the path of the page where the cookie was created (standard browser behavior). If you want to make it available for instance across the entire domain use path: '/'. Default: path of page where the cookie was created.
		$.cookie(name, value, { expires: expiryDay, path: '/' });
	}
	cookies.Read = function(name){
		var value;
		value = $.cookie(name);
		return value;
	}
	cookies.Remove = function(name){
		var removeStatus = $.removeCookie(name, { path: '/' });
		return removeStatus;
	}
	cookies.RemoveAllCookies = function(){
		var allCookies = $.cookie();
		for(var key in allCookies){
			var removeResultDesc = "Remove cookies: "+key;
			var removeStatus = $.removeCookie(key);
			removeResultDesc += removeStatus;
			console.log(removeResultDesc);
		}
	}
	cookies.PrintAllCookies = function(){
		var allCookies = $.cookie();
		var cooliesAsJsonText = JSON.stringify(allCookies, null, 4);
		console.dir(allCookies);
		console.log(cooliesAsJsonText);
	}
});

app.service('SysMessageManager', ["$rootScope", "$log", "config", function($rootScope, $log, config) {
	var message = this;
	var rootScope = $rootScope;
    
    // GetMessageText(msgID, parma1, parma2...)
    // msgID: message unique ID
    // parma: parma will be merge in the message
    // reference: https://stackoverflow.com/questions/18405736/is-there-a-c-sharp-string-format-equivalent-in-javascript
    message.GetMessageText = function(){
        var msgID = arguments[0];
        var msg = message.GetMessage(msgID);
        var args = arguments;
        var text = msg.replace(/{(\d+)}/g, function(match, number) {
          return typeof args[number++] != 'undefined'
            ? args[number++]
            : match
          ;
        });
        return text;
    }
    
    message.GetMessage = function(msgID){
        var messageList = {
            PageRecordsLimitDefault: "<PAGEVIEW> attribute of page-records-limit default as {0}",
            PageviewValidateRecord: "scope.$id:{0}, may implement $scope.ValidateRecord() function in webapge",
            PageviewEventListener: "scope.$id:{0}, may implement $scope.EventListener() function in webapge",
            CustomPointedToRecordNotFound: "<PAGEVIEW> program ID: {0} may implement CustomPointedToRecord() function in webpage",
            CustomSelectedToRecordNotFound: "<PAGEVIEW> program ID: {0} may implement CustomSelectedToRecord() function in webpage",
            BeginningOfThePageCannotGotoPrevious: "<PAGEVIEW> program ID: {0} already at the first page, cannot go previous.",
            DisplayPageNum: "<PAGEVIEW> program ID: {0} going to display the records of the Page no.({1})",
        }
        
        var msg = "";
        if(typeof(messageList[msgID]) != "undefined")
            msg = messageList[msgID];
        return msg;
    }
    message.Print = function(msgID, caller, issueType, logType){
        var text = message.GetMessageText(msgID);
        message.WriteLog(text, caller, issueType, logType);
    }
   
	message.WriteLog = function(msg, caller, issueType, logType){
        if(typeof(logType) == "undefined") logType = "log";
        if(typeof(caller) == "undefined") caller = "MessageManager";
        if(typeof(issueType) == "undefined") issueType = "Default";

        logType = logType.toLowerCase();
        switch(logType){
            case "log":
                message.L(msg);
                break;
            case "warn":
                message.W(msg);
                break;
            case "info":
                message.I(msg);
                break;
            case "error":
                message.E(msg);
                break;
        }
		if(config.debugLog.ShowCallStack)
			console.trace();
	}
    message.L = function(msg, caller, issueType, issueCategory){
        if(typeof(caller) == "undefined") caller = "MessageManager";
        if(typeof(issueType) == "undefined") issueType = "Default";
        if(typeof(issueCategory) == "undefined") issueCategory = "None";
        if(!CheckLoggingAvailable(caller, issueType, issueCategory)) return;
        $log.log(msg);
        if(!CheckLoggingTraceCallStack(caller, issueType)) return;
        console.trace()
    }
	message.W = function(msg, caller, issueType, issueCategory){
        if(typeof(caller) == "undefined") caller = "MessageManager";
        if(typeof(issueType) == "undefined") issueType = "Default";
        if(typeof(issueCategory) == "undefined") issueCategory = "None";
        if(!CheckLoggingAvailable(caller, issueType, issueCategory)) return;
        $log.warn(msg);
        if(!CheckLoggingTraceCallStack(caller, issueType)) return;
        console.trace()
	}
	message.I = function(msg, caller, issueType, issueCategory){
        if(typeof(caller) == "undefined") caller = "MessageManager";
        if(typeof(issueType) == "undefined") issueType = "Default";
        if(typeof(issueCategory) == "undefined") issueCategory = "None";
        if(!CheckLoggingAvailable(caller, issueType, issueCategory)) return;
        $log.info(msg);
        if(!CheckLoggingTraceCallStack(caller, issueType)) return;
        console.trace()
	}
	message.E = function(msg, caller, issueType, issueCategory){
        if(typeof(caller) == "undefined") caller = "MessageManager";
        if(typeof(issueType) == "undefined") issueType = "Default";
        if(typeof(issueCategory) == "undefined") issueCategory = "None";
        if(!CheckLoggingAvailable(caller, issueType, issueCategory)) return;
        $log.error(msg);
        if(!CheckLoggingTraceCallStack(caller, issueType)) return;
        console.trace()
	}
	message.D = function(msg, caller, issueType, issueCategory){
        if(typeof(caller) == "undefined") caller = "MessageManager";
        if(typeof(issueType) == "undefined") issueType = "Default";
        if(typeof(issueCategory) == "undefined") issueCategory = "None";
        if(!CheckLoggingAvailable(caller, issueType, issueCategory)) return;
        $log.debug(msg);
        if(!CheckLoggingTraceCallStack(caller, issueType)) return;
        console.trace()
	}
    
    function CheckLoggingAvailable(caller, issueType){
        var isValid = true;
        var debugLogConfig = config.debugLog;
        
        if(typeof(debugLogConfig[issueType]) != "undefined")
            isValid = debugLogConfig[issueType];
        
        else if(typeof(debugLogConfig[caller]) != "undefined")
            isValid = debugLogConfig[caller];
        
        return isValid;
    }
    function CheckLoggingTraceCallStack(){
        var isValid = false;
        var debugLogConfig = config.debugLog;
        if(typeof(debugLogConfig["ShowCallStack"]) != "undefined")
            isValid = debugLogConfig["ShowCallStack"];
        return isValid;
    }
}]);

app.service('TableManager', ["$rootScope", "$log", "config", "$q", "Security", "HttpRequeset", "DataAdapter", "Core", function($rootScope, $log, config, $q, Security, HttpRequeset, DataAdapter, Core) {
	var table = this;
	var rootScope = $rootScope;
    
    if(typeof $rootScope.Table == "undefined")
        $rootScope.Table = {};
    
    var tableCollection = $rootScope.Table;
    
    table.RequestTableStructure = function(progID){
        var url = $rootScope.serverHost;
        var clientID = Security.GetSessionID();
        var programId = progID
        var submitData = {
            "Session": clientID,
            "Table": programId
        };
        submitData.Action = "GetTableStructure";

        var requestOption = {
            method: 'POST',
            data: JSON.stringify(submitData)
        };
        var request = HttpRequeset.send(requestOption);
//        request.then(function(responseObj) {
//            if(Core.GetConfig().debugLog.DirectiveFlow)
//            console.log("ProgramID: "+programId+", Table structure obtained.")
//            var structure = responseObj.data.ActionResult.table_schema;
//            table.SetTableStructure(progID, structure);
//        }, function(reason) {
//          console.error("Fail in GetTableStructure() - "+tagName + ":"+$scope.programId)
//          Security.HttpPromiseFail(reason);
//                    reject(reason);
//        }).finally(function() {
//            // Always execute this on both error and success
//        });

        return request;
    }
    table.SetTableStructure = function(progID, _tableSchema){
        if(typeof $rootScope.Table[progID] == "undefined"){
            $rootScope.Table[progID] = {name:"", _tableSchema:{}, record:{}, lastUpdated:new Date()};
        }
        var tbInfo = $rootScope.Table[progID];
        if(typeof tbInfo._tableSchema == "undefined" || tbInfo._tableSchema == null || tbInfo._tableSchema == {}){
            $rootScope.Table[progID]._tableSchema = {};
        }
        $rootScope.Table[progID]._tableSchema = _tableSchema;
    }
    table.GetTableStructure = function(submitData){
    	var progID = submitData.Table;
        var isExists = table.IsTableStructeExists(progID);
        var ngPromise;
        
        if(!isExists){
            
            ngPromise = $q(function(resolve, reject) {
                // var tbRequest = table.RequestTableStructure(progID);
                var tbPromise = DataAdapter.GetTableStructure(submitData);
                tbPromise.then(function(responseObj) {
                    if(Core.GetConfig().debugLog.DirectiveFlow)
                    	console.log("ProgramID: "+programId+", Table structure obtained.")
                    var structure = responseObj.table_schema;
                    table.SetTableStructure(progID, responseObj.TableSchema);

                    resolve(responseObj);
                }, function(reason) {

                    reject(reason);
                }).finally(function() {
                    // Always execute this on both error and success
                });
            
            });
        }else{
            console.log("TableStructure already exists, avoid to send GetTableStructure again");
            ngPromise = $q(function(resolve, reject) {
                    var structure = tableCollection[progID].structure;
                    resolve(structure);
            });
        }
        
        return ngPromise;
    }
    table.ClearTableStrucute = function(progID){
        
    }
    table.IsTableStructeExists = function(progID){
        var isExists = false;
        
        if(typeof $rootScope.Table[progID] != "undefined"){
            var tbInfo = $rootScope.Table[progID];
            if(typeof tbInfo.structure != "undefined" && tbInfo != null && tbInfo.structure != {}){
                isExists = true;
            }
        }
        
        return isExists;
    }
    
    table.RequestTableRecords = function(){
        
    }
    table.SetTableRecords = function(){
        
    }
    table.GetTableRecords = function(){
        
    }
    table.ClearTableRecords = function(){
    }
    
    table.ClearCache = function(){
        table.ClearTableStrucute();
        table.ClearTableRecords();
    }
    table.RefreshCache = function(){
        table.ClearCache();
        table.GetTableStructure();
        table.GetTableRecords();
    }
}]);

/*
// Directive Template
app.directive('importExport', ['Security', '$rootScope', function(Security, $rootScope, $cookies) {
    function ImportExportConstructor($scope, $element, $attrs) {
        var constructor = this;
        var $ctrl = $scope.imExCtrl;
        var tagName = $element[0].tagName.toLowerCase();
        
        function TryToCallInitDirective(){
            if(typeof $scope.InitDirective == "function"){
                $scope.InitDirective($scope, $element, $attrs, $ctrl);
            }else{
                $scope.DefaultInitDirective();
            }
        }
        $scope.DefaultInitDirective = function(){
            console.log("scope.$id:"+$scope.$id+", may implement $scope.InitDirective() function in webapge");
        }
        function InitializeEntry() {
            $scope.tableStructure = {};
            //$ctrl.ngModel = {};

            // check attribute EditMode
            $scope.editMode = FindEditModeEnum($attrs.editMode);

            // check attribute programId
            var isProgramIdFound = false;
            if(typeof($attrs.programId) != undefined){
                if($attrs.programId != null && $attrs.programId !=""){
                    isProgramIdFound = true;
                }
            }
            if(isProgramIdFound){
                $scope.programId = $attrs.programId;
            }
            else
                alert("<importExport> Must declare a attribute of program-id");

            $scope.DisplayMessageList = [];
        }
        $scope.Initialize = function(){
            $scope.InitScope();
            if(typeof $scope.EventListener == "function"){
                $scope.EventListener($scope, $element, $attrs, $ctrl);
            }else{
                EventListener();
            }
            TryToCallInitDirective();
        }
        $scope.InitScope = function(){
            InitializeEntry();
        }

        function InitDirective(){
            console.log("scope.$id:"+$scope.$id+", may implement $scope.InitDirective() function in webapge");
        }
        function EventListener(){
            console.log("scope.$id:"+$scope.$id+", may implement $scope.EventListener() function in webapge");
        }
        // function SetDefaultValue(){
        //     console.log("scope.$id:"+$scope.$id+", may implement $scope.SetDefaultValue() function in webapge");
        // }
        function StatusChange(){
            console.log("scope.$id:"+$scope.$id+", may implement $scope.StatusChange() function in webapge");   
        }
        $scope.Initialize();
    }
    function templateFunction(tElement, tAttrs) {
        var globalCriteria = $rootScope.globalCriteria;
        var editModeNum = FindEditModeEnum(tAttrs.editMode);

        var template = '' +
          '<div class="custom-transclude"></div>';
        return template;
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

        controller: ImportExportConstructor,
        controllerAs: 'imExCtrl',

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
                    //console.log("entry preLink() compile");
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                    //console.log("entry postLink() compile");

                    // "scope" here is the directive's isolate scope 
                    // iElement.find('.custom-transclude').append(
                    // );
                    transclude(scope, function (clone, scope) {
                        iElement.find('.custom-transclude').append(clone);
                    })

                    // lock controls should put post here, 
                    // var globalCriteria = $rootScope.globalCriteria;
                    // if(scope.editMode == globalCriteria.editMode.None || 
                    //     scope.editMode == globalCriteria.editMode.Null ||
                    //     scope.editMode == globalCriteria.editMode.View ||
                    //     scope.editMode == globalCriteria.editMode.Delete 
                    // ){
                    //     console.log("Mode is [View | Delete | None | Null], lock all controls")
                    //     iElement.ready(function() {
                    //         if(scope.editMode == globalCriteria.editMode.Delete)
                    //             scope.LockAllInputBox();
                    //         else
                    //             scope.LockAllControls();
                    //     })
                    // }
                }
            }
		    // or
		    // return function postLink( ... ) { ... }
        },
    };
}]);
*/