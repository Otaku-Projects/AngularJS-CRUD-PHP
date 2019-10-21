// JavaScript Document
"use strict";

app.directive('export', [
    '$rootScope',
    '$timeout',
    'Core',
    'Security',
    'LockManager',
    'LoadingModal',
    'HttpRequeset',
    'MessageService',
    'DataAdapter', function($rootScope, $timeout, Core, Security, LockManager, LoadingModal, HttpRequeset, MessageService, DataAdapter) {
    function ExportConstructor($scope, $element, $attrs) {
        var constructor = this;
        var $ctrl = $scope.exportCtrl;
        var tagName = $element[0].tagName.toLowerCase();
        var loadModelInstance = {};

        var globalCriteria = $rootScope.globalCriteria;

        $scope.DisplayMessageList = MessageService.messgeList;

        $ctrl.ExportFileTypeAs = {
            availableOptions: [
                {id: '1', value: 'xlsx', name: 'xlsx'},
                {id: '2', value: 'xls', name: 'xls'},
                {id: '3', value: 'pdf', name: 'pdf'}
            ],
            selectedOption: {id: '1', value: 'xlsx', name: 'xlsx'} //This sets the default value of the select in the ui
        }
        $ctrl.IsTemplate = false;

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
        function InitializeExportDirective() {
            $scope.tableStructure = {};
            //$ctrl.ngModel = {};

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
                alert("<export> Must declare a attribute of program-id");
        }

        function ExportData(ngModel){
            var url = $rootScope.serverHost;
            var clientID = Security.GetSessionID();
            var programId = $scope.programId.toLowerCase();

            var tbStructure = $scope.tableStructure;
            var itemsColumn = tbStructure.DataColumns;

            var exportFileTypeAs = $ctrl.ExportFileTypeAs.selectedOption.value;
            var isTemplate = $ctrl.IsTemplate;

            var exportObj = {
                "Header":{},
                "Items":{}
            }

            var submitData = {
                "Session": clientID,
                "Table": programId,
                "Data": exportObj,
                "ExportFileTypeAs": exportFileTypeAs,
                "IsTemplate": isTemplate
            };
            submitData.Action = "ExportData";

            var requestOption = {
                // url: url+'/model/ConnectionManager.php', // Optional, default to /model/ConnectionManager.php
                method: 'POST',
                data: JSON.stringify(submitData)
            };

            var request = HttpRequeset.send(requestOption);
            request.then(function(responseObj) {
                var data_or_JqXHR = responseObj.data;

                var actionResult = data_or_JqXHR.ActionResult;
                SubmitDataSuccessResult(data_or_JqXHR);

                var msg = "Excel file \""+actionResult.filename+"\" generated.";
                MessageService.addMsg(msg);
            }, function(reason) {
              console.error("Fail in ExportData() - "+tagName + ":"+$scope.programId)
              Security.HttpPromiseFail(reason);
            }).finally(function(resultObj, resultObj1, resultObj2, resultObj3) {
                // Always execute this on both error and success
                $scope.UnLockAllControls();
                $scope.HideLoadModal();

                // SubmitDataResult(data_or_JqXHR, textStatus, jqXHR_or_errorThrown);
                // if(typeof $scope.CustomSubmitDataResult == "function"){
                //     $scope.CustomSubmitDataResult(data_or_JqXHR,
                //         textStatus,
                //         jqXHR_or_errorThrown,
                //         $scope,
                //         $element,
                //         $attrs,
                //         $ctrl);
                // }
            });
            return request;
        }

        function SendPostRequest(path, params, method) {
            method = method || "post"; // Set method to post by default if not specified.

            // The rest of this code assumes you are not using a library.
            // It can be made less wordy if you use one.
            var form = document.createElement("form");
            form.setAttribute("method", method);
            form.setAttribute("action", path);

            for(var key in params) {
                if(params.hasOwnProperty(key)) {
                    var hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("name", key);
                    hiddenField.setAttribute("value", params[key]);

                    form.appendChild(hiddenField);
                 }
            }

            document.body.appendChild(form);
            form.submit();
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
            InitializeExportDirective();
        }

        $scope.SubmitData = function(){
            // console.log("<"+$element[0].tagName+"> submitting data")
            var globalCriteria = $rootScope.globalCriteria;

            $scope.LockAllControls();
            $scope.ShowLoadModal();

            if(typeof $scope.ExportData == "function"){
                $scope.ExportData($ctrl.ngModel, $scope, $element, $attrs, $ctrl);
            }else{
                ExportData($ctrl.ngModel);
            }
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
            if(textStatus == "success"){
                var actionResult = data_or_JqXHR.ActionResult;
                if(data_or_JqXHR.Status == "success"){
                    // console.dir(actionResult.FileAsByteArray)
                    // console.dir(actionResult.FileAsByteString)
                    // console.dir(actionResult.FileAsBase64)

                    saveByteArray(actionResult.filename, actionResult.FileAsBase64);
                }
            }
        }
        function SubmitDataSuccessResult(data_or_JqXHR){
            var actionResult = data_or_JqXHR.ActionResult;
            saveByteArray(actionResult.filename, actionResult.FileAsBase64);
        }
        function saveByteArray(fileName, b64Data) {
            // http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
            var byteCharacters = atob(b64Data);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);

            var blob = new Blob([byteArray], {
                // type: "application/vnd.ms-excel;charset=charset=utf-8"
                // type: "Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });

            saveAs(blob, fileName);
        };
        function str2ab(str) {
          var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
          var bufView = new Uint16Array(buf);
          for (var i=0, strLen=str.length; i<strLen; i++) {
            bufView[i] = str.charCodeAt(i);
          }
          return buf;
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

        controller: ExportConstructor,
        controllerAs: 'exportCtrl',

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
