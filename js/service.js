// JavaScript Document
"use strict";

app.factory('LoadingModal', function ($window, $document) {
	var loadingModal = {};
	var loadingIcon = {};
	var loadingIconContainer = {};
    var root = {};
    root.showModal = function(msg){
    	if(typeof(msg) == "undefined" || msg == null || msg == "")
    		msg = "Loading...";

    	loadingModal = $( "<div/>", {
		  "class": "modal loading-modal",
		  // click: function() {
		  //   $( this ).toggleClass( "test" );
		  // }
		}).show().appendTo("body");

		loadingIcon = $("<div/>", {
			"class": "loading-icon",
			"html": '<i class="fa fa-circle-o-notch fa-spin fa-5x fa-fw"></i>',
		});

		loadingIconContainer = $("<div/>", {
		  "class": "modal",
		  "html": loadingIcon,
		}).show();

		loadingIconContainer.appendTo("body");
		loadingIcon.css("margin-top", ( jQuery(window).height() - loadingIcon.height() ) / 2 + "px");
    };
    root.hideModal = function(){
    	loadingModal.remove();
    	loadingIconContainer.remove();
    }
    return root;
});
app.service('MessageService', function($rootScope, $timeout){
	var self = this;
	self.messageList = [];
    $rootScope.$on('$routeChangeStart', function () {
		self.messageList = [];
    });
    
	self.getMsg = function(){
		return self.messageList;
	}
	self.addMsg = function(msg){
        if(!msg)
            return;
        
        if(typeof(UIkit) != "undefined")
        	UIkit.notify("<i class='uk-info-circle'></i> "+msg, {timeout: 7000, status:'primary'});

		self.messageList.push(msg);
    }
    self.shiftMsg = function(){
        self.messageList.shift();
    }
	self.setMsg = function(msgList){
		if(typeof(msgList) == "undefined" || msgList == null)
			return;
		if(msgList.length <= 0)
			return;
        
        // clear message list
        self.messageList.length = 0;
        
        // cannot copy or assign the object directly to the messageList, it will break the assign by reference between the message directive
		for(var index in msgList){
			self.addMsg(msgList[index]);
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
/*
            var requestOption = {
                // url: url+'/model/ConnectionManager.php', // Optional, default to /model/ConnectionManager.php
                method: 'POST',
                data: JSON.stringify(submitData)
            };

            var request = HttpRequeset.send(requestOption);
            request.then(function(responseObj) {
                var data_or_JqXHR = responseObj.data;
            }, function(reason) {
              console.error("Fail in GetNextPageRecords() - "+tagName + ":"+$scope.programId)
              Security.HttpPromiseFail(reason);
            }).finally(function() {
			    // Always execute this on both error and success
			});
            return request;
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
	var dFlex = DataAdapterFlex;
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
})
app.service('DataAdapterMySQL', function($rootScope, HttpRequeset, Security){
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
		var massagedObj = {
			table_schema: data_or_JqXHR.table_schema,
			// table_columnList: data_or_JqXHR.DataColumns,
			// key_columnList: data_or_JqXHR.KeyColumns,
			DataColumns: data_or_JqXHR.DataColumns,
			KeyColumns: data_or_JqXHR.KeyColumns,
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
	dataMySQL.CreateDataRequest = function(opts){
		var url = $rootScope.serverHost;
		var clientID = Security.GetSessionID();
		var requestOptions = {
			Session: clientID,
			Table: "",
			Data: {},
			Action: "CreateData"
		}
		
		var requestOptions = Object.assign({}, requestOptions, opts);
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
})