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
app.service('ProcessResultMessage', function($timeout){
	var self = this;
	self.messageList = [];
	self.getMsgList = function(){
		return self.messageList;
	}
	self.addMsg = function(msg){
		self.messageList.push(msg);
		$timeout(function(){
	  		self.messageList.shift();
	  	}, 5000); // (milliseconds),  1s = 1000ms
	}
	self.addMsgWithoutTimeout = function(msg){
		self.messageList.push(msg);
	}
	self.setMsg = function(msgList){
		if(typeof(msgList) == "undefined" || msgList == null)
			return;
		if(msgList.length <= 0)
			return;

		for(var index in msgList){
			self.addMsgWithoutTimeout(msgList[index]);
		}
	}
	self.clear = function(){
		self.messageList = [];
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

		return $http(
			requestOptions
		);
	}
});