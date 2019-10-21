// JavaScript Document
"use strict";

app.directive('import', [
    '$rootScope',
    '$timeout',
    'Core',
    'Security',
    'LockManager',
    'LoadingModal',
    'HttpRequeset',
    'MessageService',
    'DataAdapter', function($rootScope, $timeout, Core, Security, LockManager, LoadingModal, HttpRequeset, MessageService, DataAdapter) {
    function ImportConstructor($scope, $element, $attrs) {
        var constructor = this;
        var $ctrl = $scope.importCtrl;
        var tagName = $element[0].tagName.toLowerCase();
        var loadModelInstance = {};

        var globalCriteria = $rootScope.globalCriteria;

        $scope.DisplayMessageList = MessageService.getMsg();

        function TryToCallInitDirective(){
            if(typeof $scope.InitDirective == "function"){
                $scope.InitDirective($scope, $element, $attrs, $ctrl);
            }else{
                $scope.DefaultInitDirective();
            }
        }
        $scope.DefaultInitDirective = function(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("scope.$id:"+$scope.$id+", may implement $scope.InitDirective() function in webapge");
        }
        function InitializeImportDirective() {
            $scope.tableStructure = {};
            $scope.importResult = {};

            // check attribute EditMode
            //$scope.editMode = FindEditModeEnum($attrs.editMode);

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
        }

        function ClearChildEditBox(){

        }

        function ImportData(uploadFileInfo){
            var url = $rootScope.serverHost;
            var clientID = Security.GetSessionID();
            var programId = $scope.programId.toLowerCase();

            var importExportObj = {
                "Header":{},
                "Items":{}
            }

            // console.dir(uploadFileInfo);
            // check File Object
            if(uploadFileInfo == null || uploadFileInfo.length <1){
                $scope.UnLockAllControls();
                return;
            }
            for (var i = 0; i<uploadFileInfo.length ; i++) {
                var resultObject = uploadFileInfo[i];
                if(resultObject.error != 0){
                    $scope.UnLockAllControls();
                    return;
                }
            }

            //MessageService.clear();

			var submitData = {
				"Table": programId,
                "recordObj": uploadFileInfo
			};
            var request = DataAdapter.ImportData(submitData);

            // var request = HttpRequeset.send(requestOption);

            var httpResponseObj = {};
            request.then(function(responseObj) {
                httpResponseObj = responseObj;
                MessageService.setMsg(httpResponseObj.message);

            }, function(reason) {
              console.error("Fail in ImportData() - "+tagName + ":"+$scope.programId)
              Security.HttpPromiseFail(reason);
            }).finally(function() {
                // Always execute this on both error and success
                $scope.UnLockAllControls();
                $scope.HideLoadModal();

                SubmitDataResult(httpResponseObj, httpResponseObj.status);
                if(typeof $scope.CustomSubmitDataResult == "function"){
                    $scope.CustomSubmitDataResult(httpResponseObj,
                        httpResponseObj.status,
                        $scope,
                        $element,
                        $attrs,
                        $ctrl);
                }
            });
            return request;
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
            InitializeImportDirective();
        }

        $scope.SubmitData = function(uploadFileInfo){
            // console.log("<"+$element[0].tagName+"> submitting data")
            // var editMode = $scope.editMode;
            // var globalCriteria = $rootScope.globalCriteria;

            $scope.LockAllControls();
            $scope.ShowLoadModal();

            ImportData(uploadFileInfo);

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

        function SubmitDataResult(data_or_JqXHR, textStatus, jqXHR_or_errorThrown){
        }
//        $scope.Initialize();
    }

    function templateFunction(tElement, tAttrs) {
        var globalCriteria = $rootScope.globalCriteria;

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

        controller: ImportConstructor,
        controllerAs: 'importCtrl',

        //If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
        bindToController: {
            ngModel: '=',
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
                    scope.Initialize();
                }
            }
        },
    };
}]);