// JavaScript Document
"use strict";

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
		$rootScope.icon = (config.icon) ? config.icon : "font_awesome4";
		
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
	
    core.GetEditModeEnum = function(attrEditMode){
		attrEditMode = attrEditMode.toLowerCase();
        var editModeList = $rootScope.globalCriteria.editMode;
        var isEditModeExists = false;
        var isEditModeNumeric = false;
        var isEditModeValid = false;
        var editMode = 0;

        if(typeof(attrEditMode) != undefined){
            if(attrEditMode != null && attrEditMode !=""){
                isEditModeExists = true;
            }
        }
        if(isEditModeExists){
            isEditModeNumeric = !isNaN(parseInt(attrEditMode));
        }
        if(!isEditModeExists){
            editMode = editModeList.None;
        }else{
			for(var index in editModeList){
				var modeLowerCase = index.toLowerCase();
				var value = editModeList[index];
				if(isEditModeNumeric){
					if(attrEditMode == value)
					{
						isEditModeValid = true;
						break;
					}
				}else{
					if(attrEditMode == modeLowerCase)
					{
						attrEditMode = value
						isEditModeValid = true;
						break;
					}
				}
			}
        }
		if(!isEditModeValid){
			console.trace("stack trace details")
			throw ("Unable to identify the edit mode '"+attrEditMode+"' on directive");
		}
        return editMode;
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

// 20180917, keithpoon, fixed: now can create instance for LoadingModal
app.factory('LoadingModal', function ($window, $document, $rootScope) {
    var root = function(){
        var loadingModal = {};
        var loadingIcon = {};
        var loadingIconContainer = {};
        var seed = Math.floor(Math.random() * 100) + 1;

        var showModal = function(msg){
            if(typeof(msg) == "undefined" || msg == null || msg == "")
                msg = "Loading...";

            loadingModal = $( "<div/>", {
            "class": "modal loading-modal",
            // click: function() {
            //   $( this ).toggleClass( "test" );
            // }
            }).show().appendTo("body");
            
            if($rootScope.icon == "font_awesome4"){
            // font awesome 4.7
            loadingIcon = $("<div/>", {
                "class": "loading-icon",
                "html": '<i class="fa fa-circle-o-notch fa-spin fa-5x fa-fw"></i>',
            });
            }else if ($rootScope.icon == "font_awesome5"){
            
            // font awesome 5
            loadingIcon = $("<div/>", {
                "class": "loading-icon",
                "html": '<i class="fas fa-circle-notch fa-spin fa-5x fa-fw"></i>',
            });
            
            }

            loadingIconContainer = $("<div/>", {
            "class": "modal",
            "html": loadingIcon,
            }).show();

            loadingIconContainer.appendTo("body");
            loadingIcon.css("margin-top", ( jQuery(window).height() - loadingIcon.height() ) / 2 + "px");
        };
        var hideModal = function(){
            loadingModal.remove();
            loadingIconContainer.remove();
        }

        return {
            showModal: showModal,
            hideModal: hideModal
        }
    };
    return root;
});

app.service('MessageService', function($rootScope, $timeout, ThemeService){
	var self = this;
    self.messageList = [];
    // clear message when ng-route event
    $rootScope.$on('$routeChangeStart', function () {
		self.messageList = [];
    });
    // clear message when ui-route event
    $rootScope.$on("$viewContentLoaded", function(targetScope){
		self.messageList = [];
    });
    
	self.getMsg = function(){
		return self.messageList;
	}
	self.addMsg = function(msg){
        if(!msg)
            return;
            
        var themeName = ThemeService.GetThemeName();
        switch(theme){
            case "D":
            case "B":
                if($.notify){
                    $.notify({
                        // options
                        message: msg 
                    },{
                        // settings
                        type: 'success',
                        placement: {
                            from: "top",
                            align: "center"
                        },
                        timer: 7000
                    });
                }
            break;
            case "U":
                if(typeof(UIkit) != "undefined")
                    UIkit.notify("<i class='uk-info-circle'></i> "+msg, {timeout: 7000, status:'primary'});
            break;
        }

		self.messageList.push(msg);
    }
    self.shiftMsg = function(){
        self.messageList.shift();
    }
    // for import message, no need to prompt as alert
	self.setMsg = function(msgList){
		if(typeof(msgList) == "undefined" || msgList == null)
			return;
		if(msgList.length <= 0)
			return;
        
        // clear message list
        // self.messageList.length = 0;
        self.clear();
        
        // cannot copy or assign the object directly to the messageList, it will break the assign by reference between the message directive
		for(var index in msgList){
            //self.addMsg(msgList[index], hiddenOnScreen);
            self.messageList.push(msgList[index]);
		}
        
	}
	self.clear = function(){
        for(var index in self.messageList){
            self.messageList.shift();
        }
	}
});

//
// call HttpRequest simple
/*
Object{
	data – {string|Object} – The response body transformed with the transform functions.
	status – {number} – HTTP status code of the response.
	headers – {function([headerName])} – Header getter function.
	config – {Object} – The configuration object that was used to generate the request.
	statusText – {string} – HTTP status text of the response.
}
e.g
Object{
	data: Object
	status: 200
	headers: function()
	config: Object
	statusText: "OK"
}
*/
app.service('HttpRequeset', function($rootScope, $http){
	var self = this;
	// return $q(function(resolve, reject){
	// })
	self.send = function(requestOptions){
		var url = $rootScope.serverHost;
		if(typeof(requestOptions.url) == "undefined")
			requestOptions.url = url+'/model/ConnectionManager.php';
        
        requestOptions.cache = false;

//		return $http(
//			requestOptions
//		);
        return SendXMLHttpRequest(requestOptions);
	}
    
    self.GetTemplate = function(templatePath){
        var requestOptions = {
            method: "GET",
            url: templatePath
        }
		return SendXMLHttpRequest(requestOptions);
	}
    
    function SendXMLHttpRequest(requestOptions){
        return $http(requestOptions);
    }
});

app.service('TemplateService', function($rootScope, $http, HttpRequeset){
	var tpService = this;
	
	tpService.GetTemplate = function(templatePath){
		return HttpRequeset.GetTemplate(templatePath);
	}
})

// handle the input / output of the server API
app.service('DataAdapter', function($rootScope, $q, HttpRequeset, DataAdapterMySQL, Security, config){
	var adapter = this;
	var dAdapter = null;
	var dPHP = DataAdapterMySQL;
	switch(config.dataServer){
		case "php":
			dAdapter = dPHP;
			break;
	}

	adapter.GetTableStructure = function(opts){
		var requestObj = dAdapter.GetTableStructureRequest(opts);

		var promise = $q(function(resolve, reject){
			HttpRequeset.send(requestObj).then(
			function(responseObj) {
				var massagedObj = dAdapter.GetTableStructureResponse(responseObj);
				resolve(massagedObj);
			}, function(reasonObj){
				Security.HttpPromiseReject(reasonObj);
				reject(reasonObj);
			}).catch(function(e) {
				Security.HttpPromiseErrorCatch(e);
            });
		})
		return promise;
	}
	adapter.GetData = function(opts){
		var requestObj = dAdapter.GetDataRequest(opts);

		var promise = $q(function(resolve, reject){
			HttpRequeset.send(requestObj).then(
			function(responseObj) {
				var massagedObj = dAdapter.GetDataResponse(responseObj);
				resolve(massagedObj);
			}, function(reasonObj){
				Security.HttpPromiseReject(reasonObj);
				reject(reasonObj);
			}).catch(function(e) {
				Security.HttpPromiseErrorCatch(e);
            });
		})
		return promise;
	}
	adapter.FindData = function(opts){
		var requestObj = dAdapter.FindDataRequest(opts);

		var promise = $q(function(resolve, reject){
			HttpRequeset.send(requestObj).then(
			function(responseObj) {
				var massagedObj = dAdapter.FindDataResponse(responseObj);
				resolve(massagedObj);
			}, function(reasonObj){
				Security.HttpPromiseReject(reasonObj);
				reject(reasonObj);
			}).catch(function(e) {
				Security.HttpPromiseErrorCatch(e);
            });
		})
		return promise;
	}
	adapter.CreateData = function(opts){
		var requestObj = dAdapter.CreateDataRequest(opts);

		var promise = $q(function(resolve, reject){
			HttpRequeset.send(requestObj).then(
			function(responseObj) {
				var massagedObj = dAdapter.CreateDataResponse(responseObj);
				resolve(massagedObj);
			}, function(reasonObj){
				Security.HttpPromiseReject(reasonObj);
				reject(reasonObj);
			}).catch(function(e) {
				Security.HttpPromiseErrorCatch(e);
            });
		})
		return promise;
	}
	adapter.UpdateData = function(opts){
		var requestObj = dAdapter.UpdateDataRequest(opts);

		var promise = $q(function(resolve, reject){
			HttpRequeset.send(requestObj).then(
			function(responseObj) {
				var massagedObj = dAdapter.UpdateDataResponse(responseObj);
				resolve(massagedObj);
			}, function(reasonObj){
				Security.HttpPromiseReject(reasonObj);
				reject(reasonObj);
			}).catch(function(e) {
				Security.HttpPromiseErrorCatch(e);
            });
		})
		return promise;
	}
	adapter.DeleteData = function(opts){
		var requestObj = dAdapter.DeleteDataRequest(opts);

		var promise = $q(function(resolve, reject){
			HttpRequeset.send(requestObj).then(
			function(responseObj) {
				var massagedObj = dAdapter.DeleteDataResponse(responseObj);
				resolve(massagedObj);
			}, function(reasonObj){
				Security.HttpPromiseReject(reasonObj);
				reject(reasonObj);
			}).catch(function(e) {
				Security.HttpPromiseErrorCatch(e);
            });
		})
		return promise;
	}
	adapter.ExportData = function(opts){
		var requestObj = dAdapter.ExportDataRequest(opts);

		var promise = $q(function(resolve, reject){
			HttpRequeset.send(requestObj).then(
			function(responseObj) {
				var massagedObj = dAdapter.ExportDataResponse(responseObj);
				resolve(massagedObj);
			}, function(reasonObj){
				Security.HttpPromiseReject(reasonObj);
				reject(reasonObj);
			}).catch(function(e) {
				Security.HttpPromiseErrorCatch(e);
            });
		})
		return promise;
	}
	adapter.ImportData = function(opts){
		var requestObj = dAdapter.ImportDataRequest(opts);

		var promise = $q(function(resolve, reject){
			HttpRequeset.send(requestObj).then(
			function(responseObj) {
				var massagedObj = dAdapter.ImportDataResponse(responseObj);
				resolve(massagedObj);
			}, function(reasonObj){
				Security.HttpPromiseReject(reasonObj);
				reject(reasonObj);
			}).catch(function(e) {
				Security.HttpPromiseErrorCatch(e);
            });
		})
		return promise;
	}
	adapter.InquiryData = function(opts){
		var requestObj = dAdapter.InquiryDataRequest(opts);

		var promise = $q(function(resolve, reject){
			HttpRequeset.send(requestObj).then(
			function(responseObj) {
				var massagedObj = dAdapter.InquiryDataResponse(responseObj);
				resolve(massagedObj);
			}, function(reasonObj){
				Security.HttpPromiseReject(reasonObj);
				reject(reasonObj);
			}).catch(function(e) {
				Security.HttpPromiseErrorCatch(e);
            });
		})
		return promise;
	}
	adapter.ProcessData = function(opts){
		var requestObj = dAdapter.ProcessDataRequest(opts);

		var promise = $q(function(resolve, reject){
			HttpRequeset.send(requestObj).then(
			function(responseObj) {
				var massagedObj = dAdapter.ProcessDataResponse(responseObj);
				resolve(massagedObj);
			}, function(reasonObj){
				Security.HttpPromiseReject(reasonObj);
				reject(reasonObj);
			}).catch(function(e) {
				Security.HttpPromiseErrorCatch(e);
            });
		})
		return promise;
	}
})
app.service('DataAdapterMongoDB', function($rootScope, Security){
	var dataMongoDB = this;
})
app.service('DataAdapterMySQL', function($rootScope, Security, Core){
	var dataMySQL = this;
	dataMySQL.GetTableStructureRequest = function(opts){
		var url = $rootScope.serverHost;
		var clientID = Security.GetSessionID();
		var requestOptions = {
			Session: clientID,
			Table: "",
			Action: "GetTableStructure"
		}
		
		// ECMA6 merge two object
		// https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
		// https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
		var requestOptions = Object.assign({}, requestOptions, opts);
		var requestObject = {
			method: 'POST',
			// url: url+'/GetData',
			data: JSON.stringify(requestOptions),
			// contentType: "application/json",
			//  dataType: "json", // [xml, json, script, or html]
		}
		return requestObject;
	}
	dataMySQL.GetTableStructureResponse = function(responseObj){
		var data_or_JqXHR = responseObj.data;
		var converted_Data = ConvertGetTableStructure(data_or_JqXHR);
		var massagedObj = {
			table_schema: data_or_JqXHR.table_schema,
			DataColumns: converted_Data.DataColumns,
			KeyColumns: data_or_JqXHR.KeyColumns,
			TableSchema: {
				DataDict: data_or_JqXHR.table_schema,
				DataColumns: converted_Data.DataColumns,
				KeyColumns: data_or_JqXHR.KeyColumns
			},
			message: data_or_JqXHR.Message,
			status: data_or_JqXHR.Status,
			HTTP: {
				statusCode: responseObj.status,
				statusText: responseObj.statusText,
			}
		}

		return massagedObj;
	}
	dataMySQL.GetDataRequest = function(opts){
		var url = $rootScope.serverHost;
		var clientID = Security.GetSessionID();
		var requestOptions = {
			Session: clientID,
			Table: "",
            PageNum: 1,
            PageRecordsLimit: 10,
			Offset: 0,
			criteria: {},
			Action: "GetData"
		}
		
		var requestOptions = Object.assign({}, requestOptions, opts);
		var requestObject = {
			method: 'POST',
			data: JSON.stringify(requestOptions),
		}
		return requestObject;
	}
	dataMySQL.GetDataResponse = function(responseObj){
		var data_or_JqXHR = responseObj.data;
		var converted_Data = ConvertGetTableStructure(data_or_JqXHR.ActionResult);
		var massagedObj = {
			table_schema: data_or_JqXHR.ActionResult.table_schema,
			TableSchema: {
				DataDict: data_or_JqXHR.ActionResult.table_schema,
				DataColumns: converted_Data.DataColumns,
				KeyColumns: data_or_JqXHR.ActionResult.KeyColumns
			},
			data: data_or_JqXHR.ActionResult.data,
			TotalRecordCount: (data_or_JqXHR.TotalRecordCount) ? data_or_JqXHR.TotalRecordCount : -1,
			message: data_or_JqXHR.Message,
			status: data_or_JqXHR.Status,
			HTTP: {
				statusCode: responseObj.status,
				statusText: responseObj.statusText,
			}
		}

		return massagedObj;
	}
	dataMySQL.FindDataRequest = function(opts){
		var url = $rootScope.serverHost;
		var clientID = Security.GetSessionID();
		var requestOptions = {
			Session: clientID,
			Table: "",
			Data: {},
			Action: "FindData"
		}
		
		var requestOptions = Object.assign({}, requestOptions, opts);
		var requestObject = {
			method: 'POST',
			data: JSON.stringify(requestOptions),
		}
		return requestObject;
	}
	dataMySQL.FindDataResponse = function(responseObj){
		var data_or_JqXHR = responseObj.data;
		var converted_Data = ConvertGetTableStructure(data_or_JqXHR.ActionResult);
		var massagedObj = {
			table_schema: data_or_JqXHR.ActionResult.table_schema,
			TableSchema: {
				DataDict: data_or_JqXHR.ActionResult.table_schema,
				DataColumns: converted_Data.DataColumns,
				KeyColumns: data_or_JqXHR.ActionResult.KeyColumns
			},
			data: data_or_JqXHR.ActionResult.data,
			TotalRecordCount: (data_or_JqXHR.TotalRecordCount) ? data_or_JqXHR.TotalRecordCount : -1,
			message: data_or_JqXHR.Message,
			status: data_or_JqXHR.Status,
			HTTP: {
				statusCode: responseObj.status,
				statusText: responseObj.statusText,
			}
		}

		return massagedObj;
	}
	dataMySQL.CreateDataRequest = function(opts){
		var url = $rootScope.serverHost;
		var clientID = Security.GetSessionID();

    	var createObj = {
            "Header":{},
            "Items":{}
    	}
    	createObj.Header[1] = opts.recordObj;

		var requestOptions = {
			Session: clientID,
			Table: opts.Table,
			Data: createObj,
			Action: "CreateData"
		}
		
		// var requestOptions = Object.assign({}, requestOptions, opts);
		var requestObject = {
			method: 'POST',
			data: JSON.stringify(requestOptions),
		}
		return requestObject;
	}
	dataMySQL.CreateDataResponse = function(responseObj){
		var data_or_JqXHR = responseObj.data;
		var massagedObj = {
			table_schema: data_or_JqXHR.ActionResult.table_schema,
			data: data_or_JqXHR.ActionResult.data,
			message: data_or_JqXHR.Message,
			status: data_or_JqXHR.Status,
			HTTP: {
				statusCode: responseObj.status,
				statusText: responseObj.statusText,
			}
		}

		return massagedObj;
	}
	dataMySQL.UpdateDataRequest = function(opts){
		var url = $rootScope.serverHost;
		var clientID = Security.GetSessionID();
		var requestOptions = {
			Session: clientID,
			Table: "",
			Data: {},
			Action: "UpdateData"
		}
		
		var requestOptions = Object.assign({}, requestOptions, opts);
		var requestObject = {
			method: 'POST',
			data: JSON.stringify(requestOptions),
		}
		return requestObject;
	}
	dataMySQL.UpdateDataResponse = function(responseObj){
		var data_or_JqXHR = responseObj.data;
		var massagedObj = {
			table_schema: data_or_JqXHR.ActionResult.table_schema,
			data: data_or_JqXHR.ActionResult.data,
			message: data_or_JqXHR.Message,
			status: data_or_JqXHR.Status,
			HTTP: {
				statusCode: responseObj.status,
				statusText: responseObj.statusText,
			}
		}

		return massagedObj;
	}
	dataMySQL.DeleteDataRequest = function(opts){
		var url = $rootScope.serverHost;
		var clientID = Security.GetSessionID();
		var requestOptions = {
			Session: clientID,
			Table: "",
			Data: {},
			Action: "DeleteData"
		}
		
		var requestOptions = Object.assign({}, requestOptions, opts);
		var requestObject = {
			method: 'POST',
			data: JSON.stringify(requestOptions),
		}
		return requestObject;
	}
	dataMySQL.DeleteDataResponse = function(responseObj){
		var data_or_JqXHR = responseObj.data;
		var massagedObj = {
			table_schema: data_or_JqXHR.ActionResult.table_schema,
			data: data_or_JqXHR.ActionResult.data,
			message: data_or_JqXHR.Message,
			status: data_or_JqXHR.Status,
			HTTP: {
				statusCode: responseObj.status,
				statusText: responseObj.statusText,
			}
		}

		return massagedObj;
    }
    dataMySQL.ImportDataRequest = function(opts){
		var clientID = Security.GetSessionID();

		var requestOptions = {
			Session: clientID,
			Table: opts.Table,
			FileUploadedResult: opts.recordObj,
			Action: "ImportData"
		}
		
		// var requestOptions = Object.assign({}, requestOptions, opts);
		var requestObject = {
			method: 'POST',
			data: JSON.stringify(requestOptions),
		}
		return requestObject;
		
    }
	dataMySQL.ImportDataResponse = function(responseObj){
		var data_or_JqXHR = responseObj.data;
		var massagedObj = {
			table_schema: data_or_JqXHR.ActionResult.table_schema,
			data: data_or_JqXHR.ActionResult.data,
			message: data_or_JqXHR.ActionResult.processed_message,
			status: data_or_JqXHR.Status,
			HTTP: {
				statusCode: responseObj.status,
				statusText: responseObj.statusText,
			}
		}

		return massagedObj;
	}
	dataMySQL.ProcessDataRequest = function(opts){
		var url = $rootScope.serverHost;
		var clientID = Security.GetSessionID();
		var requestOptions = {
			Session: clientID,
			Action: "ProcessData"
		}
		
		var requestOptions = Object.assign({}, requestOptions, opts);
		var requestObject = {
			method: 'POST',
			data: JSON.stringify(requestOptions),
		}
		return requestObject;
	}
	dataMySQL.ProcessDataResponse = function(responseObj){
		var data_or_JqXHR = responseObj.data;
        var converted_Data = ConvertGetTableStructure(data_or_JqXHR.ActionResult);
		var massagedObj = {
			table_schema: data_or_JqXHR.ActionResult.table_schema,
			TableSchema: {
				DataDict: data_or_JqXHR.ActionResult.table_schema,
				DataColumns: converted_Data.DataColumns,
				KeyColumns: data_or_JqXHR.ActionResult.KeyColumns
			},
			data: data_or_JqXHR.ActionResult.data,
			TotalRecordCount: (data_or_JqXHR.TotalRecordCount) ? data_or_JqXHR.TotalRecordCount : -1,
			message: data_or_JqXHR.ActionResult.processed_message,
			status: data_or_JqXHR.Status,
			HTTP: {
				statusCode: responseObj.status,
				statusText: responseObj.statusText,
			}
		}
		return massagedObj;
    }
    
	dataMySQL.InquiryDataRequest = function(opts){
		var url = $rootScope.serverHost;
		var clientID = Security.GetSessionID();
		var requestOptions = {
			Session: clientID,
			Action: "InquiryData"
		}
		
		var requestOptions = Object.assign({}, requestOptions, opts);
		var requestObject = {
			method: 'POST',
			data: JSON.stringify(requestOptions),
		}
		return requestObject;
	}
	dataMySQL.InquiryDataResponse = function(responseObj){
		var data_or_JqXHR = responseObj.data;
        var converted_Data = ConvertGetTableStructure(data_or_JqXHR.ActionResult);
		var massagedObj = {
			table_schema: data_or_JqXHR.ActionResult.table_schema,
			TableSchema: {
				DataDict: data_or_JqXHR.ActionResult.table_schema,
				DataColumns: converted_Data.DataColumns,
				KeyColumns: data_or_JqXHR.ActionResult.KeyColumns
			},
			data: data_or_JqXHR.ActionResult.data,
			TotalRecordCount: (data_or_JqXHR.TotalRecordCount) ? data_or_JqXHR.TotalRecordCount : -1,
			message: data_or_JqXHR.ActionResult.processed_message,
			status: data_or_JqXHR.Status,
			HTTP: {
				statusCode: responseObj.status,
				statusText: responseObj.statusText,
			}
		}
		return massagedObj;
	}
	function ConvertGetTableStructure(data_or_JqXHR){
		var obj = {
			DataColumns: {}
		};
		var dataColumns = data_or_JqXHR.DataColumns;
		var newDataColumns = {};
		for(var columnName in dataColumns){
			var dataColumn = dataColumns[columnName];
			var newDataCol = {};
			jQuery.extend(true, newDataCol, dataColumn);

			newDataCol.type = Core.ConvertMySQLDataType(dataColumn.type);


			if(newDataCol.default === null){
				var defaultValue = null;
				switch(newDataCol.type){
					case "string":
						defaultValue = null;
						break;
					case "date":
						defaultValue = new Date(1970, 0, 1);
						break;
					case "double":
						defaultValue = 0.0;
						break;
				}
				newDataCol.default = defaultValue;
			}

			newDataColumns[columnName] = newDataCol;
		}
		
		obj.DataColumns = newDataColumns;
		
		return obj;
	}
})