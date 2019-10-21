// JavaScript Document
"use strict";

app.directive('inquiry', ['$rootScope', 
    '$timeout',
    'Core',
    'Security',
    'LockManager',
    'LoadingModal',
    'MessageService',
    'ThemeService',
    'TableManager',
    'DataAdapter', function($rootScope, $timeout, Core, Security,
    LockManager,
    LoadingModal,
    MessageService,
    ThemeService,
    TableManager,
    DataAdapter) {
    function InquiryConstructor($scope, $element, $attrs) {
        var constructor = this;
        var $ctrl = $scope.inquiryCtrl;
        var tagName = $element[0].tagName.toLowerCase();
        var loadModelInstance = {};
        function TryToCallInitDirective(){
            if(typeof $scope.InitDirective == "function"){
                $scope.InitDirective($scope, $element, $attrs, $ctrl);
            }else{
                $scope.DefaultInitDirective();
            }
        }
        $scope.DefaultInitDirective = function(){
            TryToCallSetDefaultValue();
        }
		
        function InitializeInquiry() {
            $scope.tableStructure = {};
            $scope.mousehoverRecord = {}; // mousehover's record
            $scope.pointedRecord = {}; // mouse clicked record
            $scope.selectedRecord = {}; // user tick to selected record
            
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
            // $ctrl.ngModel.Data = [];
			
			$scope.programId = $attrs.programId;
			//$scope.editMode = Core.GetEditModeEnum($attrs.editMode)

            $attrs.$observe('programId', function(newValue, oldValue){
				console.log("programId changed to: "+newValue)
                if(newValue)
                    $scope.programId = newValue;
            })
			
            // check attribute EditMode
            $attrs.$observe('editMode', function(newValue, oldValue){
				console.log("editMode changed to: "+newValue)
                if(newValue)
                    $scope.editMode = Core.GetEditModeEnum(newValue);
            })
            $attrs.$observe('display', function(newValue, oldValue){
                if(newValue)
                    $scope.display = newValue;
            })
            $attrs.$observe('pageRecordLimit', function(newValue, oldValue){
                if(newValue)
                    $scope.pageRecordLimit = newValue;
            })
            $attrs.$observe('pageinationLimit', function(newValue, oldValue){
                if(newValue)
                    $scope.pageinationLimit = newValue;
            })

            // check attribute programId
            var isProgramIdFound = false;
            if(typeof($scope.programId) != undefined){
                if($scope.programId != null && $scope.programId !=""){
                    isProgramIdFound = true;
                }
            }
            if(!isProgramIdFound)
                console.warn("<inquiry> Must declare a attribute of program-id");

            $ctrl.ngModel.Record = {}; // this structure same as the filtering record structure
            $ctrl.ngModel.InquiryCriteria = {}; // this store the customize criteria data for inquiry
            $ctrl.ngModel.InquiryResult = {}; // store the inquiry result
            $ctrl.ngModel.InquiryResult.Data = []; // store the inquiry data array records
            $ctrl.ngModel.InquiryResult.Result = {}; // store other structure request

            CreateEventListener();
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
            InitializeInquiry();
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

        $scope.ClearSelectedRecord = function(){
            $scope.selectedRecord = {};
            $scope.$parent.SetEditboxNgModel({});
        }
        
        $scope.SubmitData = function(){
        	// console.log("<"+$element[0].tagName+"> submitting data")
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

				if(typeof $scope.InquiryData == "function"){
	            	submitPromise = $scope.InquiryData($ctrl.ngModel, $scope, $element, $attrs, $ctrl);
	            }else{
	            	submitPromise = InquiryData($ctrl.ngModel);
	            }

                submitPromise.then(function(responseObj) {
                    httpResponseObj = responseObj;
                    var data_or_JqXHR = responseObj.data;

                    
                    
                    // $ctrl.ngModel.Data = data_or_JqXHR;
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

        function CreateEventListener(){
            // StatusChange() event listener
            $scope.$watch(
            // This function returns the value being watched. It is called for each turn of the $digest loop
            function() { return $ctrl.ngModel.Record; },
            // This is the change listener, called when the value returned from the above function changes
            function(newValue, oldValue) {
                var changedField = "";
                var changedValue;

                if ( newValue !== oldValue ) {
                    for(var colIndex in $ctrl.ngModel.Record){
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
        }
        function EventListener(){
        }
        function SetDefaultValue(){
        }
        function StatusChange(){
            console.log("scope.$id:"+$scope.$id+", may implement $scope.StatusChange() function in webapge");   
        }
        function SubmitDataResult(data_or_JqXHR, textStatus, jqXHR_or_errorThrown){

        }
        $scope.Initialize();
		
    }
    function templateFunction(tElement, tAttrs) {
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
        /*
		scope: {
			editMode: '=',
			programId: '=',
			ngModel: '='
		},
		*/
		scope: true,

        controller: InquiryConstructor,
        controllerAs: 'inquiryCtrl',

        //If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
		
		bindToController: {
            ngModel: '=',
            //editMode: '=',
            //programId: '='
        },
		//bindToController: true,
        template: templateFunction,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
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

app.directive('navigation', ['$rootScope', 'Core',
    'Security',
    'LockManager',
    'LoadingModal',
    'MessageService',
    'ThemeService',
    'TableManager',
    'DataAdapter', function($rootScope, Core, Security,
    LockManager,
    LoadingModal,
    MessageService,
    ThemeService,
    TableManager,
    DataAdapter) {
	function NavigationConstructor($scope, $element, $attrs) {
        var constructor = this;
        var $ctrl = $scope.inquiryCtrl;
        var tagName = $element[0].tagName.toLowerCase();
        function TryToCallInitDirective(){
            if(typeof $scope.InitDirective == "function"){
                $scope.InitDirective($scope, $element, $attrs, $ctrl);
            }else{
                $scope.DefaultInitDirective();
            }
        }
        $scope.DefaultInitDirective = function(){
            TryToCallSetDefaultValue();
        }
		
        function InitializeEntry() {
            $scope.tableStructure = {};
			
			/*
			$ctrl.ngModel = $attrs.ngModel
            if($ctrl.ngModel === null){
				console.log("ctrl.ngModel is null, assign as new object {}")
                $ctrl.ngModel = {};
			}
			*/
						
            // check attribute EditMode
            $attrs.$observe('editMode', function(newValue, oldValue){
				console.log("editMode changed to: "+newValue)
                if(newValue)
                    $scope.editMode = Core.GetEditModeEnum(newValue);
            })
            $attrs.$observe('display', function(newValue, oldValue){
                if(newValue)
                    $scope.display = newValue;
            })
            $attrs.$observe('pageRecordLimit', function(newValue, oldValue){
                if(newValue)
                    $scope.pageRecordLimit = newValue;
            })
            $attrs.$observe('pageinationLimit', function(newValue, oldValue){
                if(newValue)
                    $scope.pageinationLimit = newValue;
            })
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
		/*
		$scope.SearchRecords = function(key){
			console.log("overrided inquiry search")
		}
		*/

        function TryToCallSetDefaultValue(){
            if(typeof $scope.SetDefaultValue == "function"){
                $scope.SetDefaultValue($scope, $element, $attrs, $ctrl);
            }else{
                SetDefaultValue();
            }
        }
        function InitDirective(){
        }
        function EventListener(){
        }
        function SetDefaultValue(){
        }
        function StatusChange(){
            console.log("scope.$id:"+$scope.$id+", may implement $scope.StatusChange() function in webapge");   
        }
        $scope.Initialize();
	}
		
    function templateUrlFunction(tElement, tAttrs) {
		if(Core.GetConfig().debugLog.DirectiveFlow)
        var directiveName = tElement[0].tagName;

        directiveName = directiveName.toLowerCase();
        var templateURL = ThemeService.GetTemplateURL(directiveName);
        return templateURL;
    }
    function templateFunction(tElement, tAttrs) {
		var navContent = "";
		var defaultNavCompoent = "<div>Home &lt;</div>"
		var navComponent = {
			"search":"<div nav-search>search</div>", 
			"display":"<div nav-display>display</div>", 
			"pageRecordLimit":"<div nav-pageRecordLimit>page record limit</div>", 
			"navarrow":"<div nav-navarrow>navarrow</div>", 
			"pageination":"<div nav-page>page</div>"
		}
		
		var toolStr = (tAttrs.tool) ? tAttrs.tool : defaultNavCompoent;
		var tools = toolStr.split(" ").map(function(item) {
			return item.trim();
		});
		for(var index in tools){
			var toolName = tools[index];
			if(navComponent.hasOwnProperty(toolName)){
				navContent += navComponent[toolName]
			}else{
				console.warn(toolName);
				console.warn("unidentified tool value in navigation directive");
			}
		}
		
		
        var template = '' +
          '<div class="custom-transclude">' +
		  navContent +
		  '</div>';
		  
        return template;
    }

    return {
		// Angular directive where one of two attributes are required
		// https://stackoverflow.com/questions/31830917/angular-directive-where-one-of-two-attributes-are-required
        require: ['?pageview', '?inquiry'],
        restrict: 'EA', //'EA', //Default in 1.3+
        transclude: true,

        // scope: [false | true | {...}]
        // false = use parent scope
        // true =  A new child scope that prototypically inherits from its parent
        // {} = create a isolate scope
		scope: true,

        controller: NavigationConstructor,
        controllerAs: 'navCtrl',

        //If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
		
		bindToController: {
            ngModel: '=',
            tool: '@',
            //programId: '='
        },
		//bindToController: true,
		//templateUrl: templateUrlFunction,
        template: templateFunction,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                    // "scope" here is the directive's isolate scope 
                    // iElement.find('.custom-transclude').append(
                    // );
                    transclude(scope, function (clone, scope) {
                        iElement.find('.custom-transclude').append(clone);
                    })
                }
            }
		    // or
		    // return function postLink( ... ) { ... }
        },
    };
}]);


app.directive('navSearch', ['$rootScope', 'Core',
    'Security',
    'LockManager',
    'LoadingModal',
    'MessageService',
    'ThemeService',
    'TableManager',
    'DataAdapter', function($rootScope, Core, Security,
    LockManager,
    LoadingModal,
    MessageService,
    ThemeService,
    TableManager,
    DataAdapter) {
	function NavSearchConstructor($scope, $element, $attrs) {
        var constructor = this;
        var $ctrl = $scope.inquiryCtrl;
        var tagName = $element[0].tagName.toLowerCase();
        function TryToCallInitDirective(){
            if(typeof $scope.InitDirective == "function"){
                $scope.InitDirective($scope, $element, $attrs, $ctrl);
            }else{
                $scope.DefaultInitDirective();
            }
        }
        $scope.DefaultInitDirective = function(){
            TryToCallSetDefaultValue();
        }
		
        function InitializeEntry() {
            $scope.tableStructure = {};
			
			$scope.searchObject = {};
			$scope.searchObject.searchText = ""
			
			$ctrl.ngModel = $attrs.ngModel
            if($ctrl.ngModel === null){
				console.log("ctrl.ngModel is null, assign as new object {}")
                $ctrl.ngModel = {};
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
            InitializeEntry();
        }

        function TryToCallSetDefaultValue(){
            if(typeof $scope.SetDefaultValue == "function"){
                $scope.SetDefaultValue($scope, $element, $attrs, $ctrl);
            }else{
                SetDefaultValue();
            }
        }
        function EventListener(){
        }
        function SetDefaultValue(){
        }
        function StatusChange(){
            console.log("scope.$id:"+$scope.$id+", may implement $scope.StatusChange() function in webapge");   
        }
        $scope.Initialize();
	}
		
    function templateUrlFunction(tElement, tAttrs) {
		if(Core.GetConfig().debugLog.DirectiveFlow)
        var directiveName = tElement[0].tagName;

        directiveName = directiveName.toLowerCase();
        var templateURL = ThemeService.GetTemplateURL(directiveName);
        return templateURL;
    }
    function templateFunction(tElement, tAttrs) {		
		
        var template = '' +
          '<div class="custom-transclude">' +
		  '<form class="form-inline">' +
		  '<div class="input-group">' +
		  '<input type="text" class="form-control" placeholder="search text..." ng-model="searchObject.searchText">' +
		  '<span class="input-group-btn">' +
		  '<button class="btn btn-default" type="submit" ng-click="SearchRecords(searchObject.searchText)"><span class="fa fa-search" aria-hidden="true"></span></button>'+
		  '</span>'+
		  '</div>' +
		  '</form>' +
		  '</div>';
		  
        return template;
    }

    return {
		// Angular directive where one of two attributes are required
		// https://stackoverflow.com/questions/31830917/angular-directive-where-one-of-two-attributes-are-required
        require: ['^ngModel', '^navigation'],
        restrict: 'EA', //'EA', //Default in 1.3+
        transclude: true,

        // scope: [false | true | {...}]
        // false = use parent scope
        // true =  A new child scope that prototypically inherits from its parent
        // {} = create a isolate scope
		scope: true,

        controller: NavSearchConstructor,
        controllerAs: 'navSearchCtrl',

        //If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
		bindToController: {
            ngModel: '=',
        },
		//templateUrl: templateUrlFunction,
        template: templateFunction,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                    // "scope" here is the directive's isolate scope 
                    // iElement.find('.custom-transclude').append(
                    // );
                    transclude(scope, function (clone, scope) {
                        iElement.find('.custom-transclude').append(clone);
                    })
                }
            }
        },
    };
}]);