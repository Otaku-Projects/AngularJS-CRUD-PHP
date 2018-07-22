// JavaScript Document
"use strict";

/**
 * <process> submit a set of criteria to perform action, for reporting, complex inquiry, processing
 * <process
    ng-model=""
    program-id=""
    edit-mode=""
    >
 * @param {Object} ng-model - store the process criteria
 * @param {String} program-id - assign the program id to implement the behavior of CRUD
 */
app.directive('process', ['$rootScope',
    '$q',
    '$timeout',
    'Core',
    'Security',
    'LockManager',
    'LoadingModal',
    'HttpRequeset',
    'MessageService',
    'DataAdapter', function($rootScope, $q, $timeout, Core, Security, LockManager, LoadingModal, HttpRequeset, MessageService, DataAdapter) {
    function ProcessConstructor($scope, $element, $attrs) {
    	var constructor = this;
    	var $ctrl = $scope.processCtrl;
        var tagName = $element[0].tagName.toLowerCase();

    	var globalCriteria = $rootScope.globalCriteria;
        var backupNgModelObj = {};

        var DirectiveProperties = (function () {
            var editMode;
            var programID;

//            function findEditMode() {
//                var object = $scope.editMode = FindEditModeEnum($attrs.editMode);
//                return object;
//            }
            function findProgramID(){
                var object = $attrs.programId;
                return object;
            }

            return {
//                getEditMode: function () {
//                    if (!editMode) {
//                        editMode = findEditMode();
//                    }
//                    return editMode;
//                },
                getProgramID: function(){
                    var isProgramIdFound = false;
                    if(!programID){
                        programID = findProgramID;
                    }
                    if(typeof(programID) != undefined){
                        if(programID != null && programID !=""){
                            isProgramIdFound = true;
                        }
                    }

                    if(isProgramIdFound){
                        $scope.programId = $attrs.programId;
                    }
                    else
                        alert("<process> Must declare a attribute of program-id");
                }
            };
        })();

        function InitializeProcess() {
        	$scope.tableStructure = {};
//            DirectiveProperties.getEditMode();
            DirectiveProperties.getProgramID();

            $scope.DisplayMessageList = MessageService.getMsg();
            $ctrl.ngModel = {};
        }

        function TryToCallInitDirective(){
            if(typeof $scope.InitDirective == "function"){
                $scope.InitDirective($scope, $element, $attrs, $ctrl);
            }else{
                $scope.DefaultInitDirective();
            }
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
            InitializeProcess();
        }
        $scope.DefaultInitDirective = function(){

        }

        $scope.SubmitData = function(){
        	console.log("<"+$element[0].tagName+"> submitting data")
            var globalCriteria = $rootScope.globalCriteria;
            MessageService.clear();

        	$scope.LockAllControls();

            if(!ValidateSubmitData()){
                return;
            }
            $scope.ShowLoadModal();
            SubmitData();
        }
        function ValidateSubmitData(){
            var isValid = true;
        	// if Buffer invalid, cannot send request
        	var isBufferValid = true;
			if(typeof $scope.ValidateBuffer == "function"){
				isBufferValid = $scope.ValidateBuffer($scope, $element, $attrs, $ctrl);
			}else{
				isBufferValid = ValidateBuffer();
			}
            isValid = isValid && isBufferValid;
			if(!isBufferValid){
                $scope.UnLockAllControls();
            }

            return isValid;
        }
        function SubmitData(){
            var httpResponseObj = {};
            var submitPromise;
            var msg = "";

				if(typeof $scope.ProcessData == "function"){
	            	submitPromise = scope.ProcessData($ctrl.ngModel, $scope, $element, $attrs, $ctrl);
	            }else{
	            	submitPromise = ProcessData($ctrl.ngModel);
	            }

                submitPromise.then(function(responseObj) {
                    httpResponseObj = responseObj;
                    var data_or_JqXHR = responseObj.data;
                    msg = data_or_JqXHR.message;
                    $ctrl.ngModel = data_or_JqXHR;
					MessageService.setMsg(msg);

                }, function(reason) {
                  console.error(tagName + ":"+$scope.programId + " - Fail in ProcessData()")
                  throw reason;
                });


            submitPromise.catch(function(e){
                // handle errors in processing or in error.
                console.log("Submit data error catch in process");
                Security.HttpPromiseFail(e);
            }).finally(function() {
                // Always execute unlock on both error and success
                $scope.UnLockAllControls();
                $timeout(function() {
                    $scope.HideLoadModal();
                }, 200);

                if(msg.length > 0)
                    MessageService.addMsg(msg);
                SubmitDataResult(httpResponseObj, httpResponseObj.status);

                if(typeof $scope.CustomSubmitDataResult == "function"){
                    $scope.CustomSubmitDataResult(httpResponseObj,
                        httpResponseObj.status,
                        $scope,
                        $element,
                        $attrs,
                        $ctrl);
                }
            }).catch(function(e){
                // handle errors in processing or in error.
                console.warn(e)
            })

            return submitPromise;
        }

        function ProcessData(recordObj){
        	var clientID = Security.GetSessionID();
        	var programId = $scope.programId.toLowerCase();

			var submitData = {
				"Table": programId,
				"Data": recordObj,
			};

            var request = DataAdapter.ProcessData(submitData);
            return request;
        }

        $scope.LockAllControls = function(){
            LockAllControls();
        }
        $scope.LockAllInputBox = function(){
            LockAllInputBox();
        }
        $scope.UnLockSubmitButton = function(){
            UnLockSubmitButton();
        }
        $scope.UnLockAllControls = function(){
			$timeout(function(){
        		UnLockAllControls();
			  	}, 2000); // (milliseconds),  1s = 1000ms
        }

        $scope.ShowLoadModal = function(){
            LoadingModal.showModal();
        }
        $scope.HideLoadModal = function(){
            LoadingModal.hideModal();
        }

        // StatusChange() event listener
		$scope.$watch(
		  // This function returns the value being watched. It is called for each turn of the $digest loop
		  function() { return $ctrl.ngModel; },
		  // This is the change listener, called when the value returned from the above function changes
		  function(newValue, oldValue) {
		  	var changedField = "";
		  	var changedValue;

		    if ( newValue !== oldValue ) {
		    	for(var colIndex in $ctrl.ngModel){
	    			changedField = colIndex;
	    			changedValue = newValue[colIndex];

	    			if(oldValue!=null){
	    				if ( Object.prototype.hasOwnProperty ) {
			    			if(oldValue.hasOwnProperty(colIndex))
			    			{
                                if(oldValue[colIndex] === newValue[colIndex]){
                                    continue;
                                }
                                if(oldValue[colIndex] == newValue[colIndex]){
                                    continue;
                                }
			    			}
		    			}
	    			}

                    // Convert to Uppercase, if the chagned field is a Key and data type is string
                    // newValue = ConvertKeyFieldToUppercase(newValue, false);

					if(typeof $scope.StatusChange == "function"){
						$scope.StatusChange(colIndex, changedValue, newValue, $scope, $element, $attrs, $ctrl);
					}else{
						StatusChange();
					}
		    	}
		    }
		  },
		  true
		);

        function LockAllControls(){
            LockManager.LockAllControls($element, tagName);
        }
        function UnLockAllControls(){
            LockManager.UnLockAllControls($element, tagName);
        }
        function LockAllInputBox(){
            LockManager.LockAllInputBox($element, tagName);
        }
        function UnLockSubmitButton(){
            LockManager.UnLockSubmitButton($element, tagName);
        }

        function TryToCallSetDefaultValue(){
            if(typeof $scope.SetDefaultValue == "function"){
                $scope.SetDefaultValue($scope, $element, $attrs, $ctrl);
            }else{
                SetDefaultValue();
            }
        }

        function InitDirective(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("scope.$id:"+$scope.$id+", may implement $scope.InitDirective() function in webapge");
        }
		function EventListener(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
			console.log("scope.$id:"+$scope.$id+", may implement $scope.EventListener() function in webapge");
		}
		function SetDefaultValue(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
			console.log("scope.$id:"+$scope.$id+", may implement $scope.SetDefaultValue() function in webapge");
		}
		function StatusChange(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
			console.log("scope.$id:"+$scope.$id+", may implement $scope.StatusChange() function in webapge");
		}
		function ValidateBuffer(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
			console.log("scope.$id:"+$scope.$id+", may implement $scope.ValidateBuffer() function in webapge");
			return true;
		}

        function CustomGetDataResult(data_or_JqXHR, textStatus, jqXHR_or_errorThrown){
            var progID = $scope.programId;
            //console.log("scope.$id:"+$scope.$id+", programId:"+progID+", must implement $scope.CustomGetDataResult() function in webapge");
        }
        function SubmitDataResult(data_or_JqXHR, textStatus, jqXHR_or_errorThrown){

        }

//        $scope.Initialize();
    }

    function templateFunction(tElement, tAttrs) {
        var globalCriteria = $rootScope.globalCriteria;

        var template = '' +
          // outside of the ng-transclude
          // '<div>'+
          // '</div>' +
          // '<div class="well well-sm">'+
          // '<p ng-repeat="dspMsg in DisplayMessageList track by $index" ng-bind="dspMsg"></p>'+
          // '</div>' +
          // inside of the ng-transclude
          //'<div ng-transclude></div>' +
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

		controller: ProcessConstructor,
		controllerAs: 'processCtrl',

		//If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
		bindToController: {
			ngModel: '=',
		},
		template: templateFunction,
		compile: function compile(tElement, tAttrs, transclude) {
		    return {
		        pre: function preLink(scope, iElement, iAttrs, controller) {
		            //console.log("process preLink() compile");
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		            //console.log("process postLink() compile");

                    // "scope" here is the directive's isolate scope
                    // iElement.find('.custom-transclude').append(
                    // );
                    transclude(scope, function (clone, scope) {
                        iElement.find('.custom-transclude').append(clone);
                    })
                    scope.Initialize();
		        }
		    }
		},
	};
}]);
