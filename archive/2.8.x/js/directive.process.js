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
        var loadModelInstance = {};

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
                        programID = findProgramID();
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
            
            var ngModel = $scope.$eval($attrs.ngModel);
            if(ngModel === null){
                console.log("ctrl.ngModel is === null, assign as new object {}")
                $ctrl.ngModel = {};
            }
            else if(ngModel == null){
                console.log("ctrl.ngModel is == null, assign as new object {}")
                $ctrl.ngModel = {};
            }
            else{
                $ctrl.ngModel = ngModel;
            }

            $ctrl.ngModel.Record = {}; // this structure same as the filtering record structure
            $ctrl.ngModel.InquiryCriteria = {}; // this store the customize criteria data for inquiry
            $ctrl.ngModel.InquiryResult = {}; // store the inquiry result
            $ctrl.ngModel.InquiryResult.Data = []; // store the inquiry data array records
            $ctrl.ngModel.InquiryResult.Result = {}; // store other structure result

            $ctrl.ngModel.ProcessCriteria = {}; // user customize criteria data for further process
            $ctrl.ngModel.ProcessRecord = []; // user select part of the InquiryResult.Data for further process

            $ctrl.ngModel.ProcessResult = {}; // store the process result
            $ctrl.ngModel.ProcessResult.Data = []; // store the process data array records
            $ctrl.ngModel.ProcessResult.Result = {}; // store other structure process
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
        
        $scope.PointedToRecord = function(pRecord, event, rowScope){
            $scope.pointedRecord = pRecord;

            // remove all background color
            angular.element(event.currentTarget).parent().find("tr").removeClass("active");

            // change the background color
            angular.element(event.currentTarget).addClass("active");

            if(typeof $scope.CustomPointedToRecord == "function"){
                $scope.CustomPointedToRecord(pRecord, rowScope, $scope, $element, $ctrl);
            }else{
                Core.SysLog.Print("CustomPointedToRecordNotFound", $scope.programId, $element[0].tagName, "CustomPointedToRecordNotFound");
            }
        }

        $scope.SelectedToRecord = function(sRecord, event, rowScope){
            $scope.selectedRecord = jQuery.extend({}, $scope.pointedRecord);
            if(
                    (
                        typeof($scope.pointedRecord) == "undefined" || $.isEmptyObject($scope.pointedRecord)
                    )
                    && 
                    (
                        typeof(sRecord) == "undefined" || $.isEmptyObject(sRecord)
                    )
                ){
                    $scope.DisplayMessage = "Please select a record"
                    return;
            }
            var sRecord = $scope.selectedRecord;

            $scope.pointedRecord = {};
            
            if(typeof $scope.CustomSelectedToRecord == "function"){
                $scope.CustomSelectedToRecord(sRecord, rowScope, $scope, $element, $ctrl);
            }else{
                Core.SysLog.Print("CustomSelectedToRecordNotFound", $scope.programId, $element[0].tagName, "CustomSelectedToRecordNotFound");
            }
            if(typeof $scope.ClosePageView == "function")
                $scope.ClosePageView();
        }
        $scope.DefaultInitDirective = function(){
            TryToCallSetDefaultValue();
        }

        $scope.InquiryData = function(){
            MessageService.clear();

        	$scope.LockAllControls();

            if(!ValidateSubmitData()){
                return;
            }
            $scope.ShowLoadModal();
            
            var httpResponseObj = {};
            var submitPromise;
            var msg = "";

				if(typeof $scope.CustomInquiryData == "function"){
	            	submitPromise = $scope.CustomInquiryData($ctrl.ngModel, $scope, $element, $attrs, $ctrl);
	            }else{
	            	submitPromise = InquiryData($ctrl.ngModel);
	            }

                submitPromise.then(function(responseObj) {
                    httpResponseObj = responseObj;
                    var data_or_JqXHR = responseObj.data;
                    //console.dir(responseObj)
                    $ctrl.ngModel.InquiryResult.Data = data_or_JqXHR;
                    MessageService.setMsg(httpResponseObj.message);

                }, function(reason) {
                  console.error(tagName + ":"+$scope.programId + " - Fail in InquiryData()")
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

                if(typeof $scope.CustomInquiryDataResult == "function"){
                    $scope.CustomInquiryDataResult(httpResponseObj,
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
		
        $scope.SubmitData = function(){
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
        function InquiryData(recordObj){
        	var clientID = Security.GetSessionID();
            var programId = $scope.programId.toLowerCase();
            
			var submitData = {
				"Table": programId,
				"InquiryCriteria": recordObj.InquiryCriteria,
				"InquiryRecord": recordObj.Record
			};

            var request = DataAdapter.InquiryData(submitData);
            return request;
        }
        function InquiryData20191114(){
            var httpResponseObj = {};
            var submitPromise;
            var msg = "";

				if(typeof $scope.CustomInquiryData == "function"){
	            	submitPromise = $scope.CustomInquiryData($ctrl.ngModel, $scope, $element, $attrs, $ctrl);
	            }else{
	            	submitPromise = MergeInquiryData($ctrl.ngModel);
	            }

                submitPromise.then(function(responseObj) {
                    httpResponseObj = responseObj;
                    var data_or_JqXHR = responseObj.data;
                    
                    $ctrl.ngModel.InquiryResult.Data = data_or_JqXHR;
                    MessageService.setMsg(httpResponseObj.message);

                }, function(reason) {
                  console.error(tagName + ":"+$scope.programId + " - Fail in InquiryData()")
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
                InquiryDataResult(httpResponseObj, httpResponseObj.status);

                if(typeof $scope.CustomInquiryDataResult == "function"){
                    $scope.CustomInquiryDataResult(httpResponseObj,
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
        function SubmitData(){			
            var httpResponseObj = {};
            var submitPromise;
            var msg = "";

			if(typeof $scope.CustomProcessData == "function"){
				submitPromise = $scope.CustomProcessData($ctrl.ngModel, $scope, $element, $attrs, $ctrl);
			}else{
				submitPromise = ProcessData($ctrl.ngModel);
			}

			submitPromise.then(function(responseObj) {
				httpResponseObj = responseObj;
				var data_or_JqXHR = responseObj.data;
				
				$ctrl.ngModel.ProcessResult.Data = data_or_JqXHR;
				MessageService.setMsg(httpResponseObj.message);

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
        
        function MergeInquiryData(ngModelObj){
        	var clientID = Security.GetSessionID();
        	var programId = $scope.programId.toLowerCase();

			var submitData = {
                "Table": programId,
				"InquiryCriteria": ngModelObj.InquiryCriteria,
				"InquiryRecord": ngModelObj.Record
			};

            var request = DataAdapter.InquiryData(submitData);
            return request;
        }
        function ProcessData(ngModelObj){
        	var clientID = Security.GetSessionID();
        	var programId = $scope.programId.toLowerCase();

			var submitData = {
				"Table": programId,
				"ProcessCriteria": ngModelObj.ProcessCriteria,
				"ProcessRecord": ngModelObj.ProcessRecord
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
            loadModelInstance = new LoadingModal();
            loadModelInstance.showModal();
        }
        $scope.HideLoadModal = function(){
            loadModelInstance.hideModal();
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
        function InquiryDataResult(data_or_JqXHR, textStatus, jqXHR_or_errorThrown){
			var responseData = data_or_JqXHR.data
            $ctrl.ngModel.InquiryResult.Data = responseData;
			$ctrl.ngModel.ProcessRecord = $ctrl.ngModel.InquiryResult.Data;
        }
        function SubmitDataResult(data_or_JqXHR, textStatus, jqXHR_or_errorThrown){

        }
    
        $scope.Initialize();
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
                    //scope.Initialize();
		        }
		    }
		},
	};
}]);
