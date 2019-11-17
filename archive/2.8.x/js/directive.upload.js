// JavaScript Document
"use strict";

app.directive('upload', [
    '$rootScope',
    '$timeout',
    'Core',
    'Security',
    'LockManager',
    'Upload',
    'MessageService',
    'DataAdapter',    function($rootScope, $timeout, Core, Security, LockManager, Upload, MessageService, DataAdapter) {
    function UploadConstructor($scope, $element, $attrs) {
        var constructor = this;
        var $ctrl = $scope.uploadCtrl;
        var tagName = $element[0].tagName.toLowerCase();
        $scope.DisplayMessageList = MessageService.messageList;

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
        function InitializeUpload() {
            $scope.uploadInfo = [];
            $scope.uploadResult = [];

            $scope.uploadInstance = null;
        }

        function UploadFileList(files){
            var isFiles = Array.isArray(files);
			
            $scope.uploadInfo = [];
			
            if(!isFiles){
                UploadFile(files);
            }
            else{
                for(var index in files){
                    UploadFile(files[index]);
                }
            }
        }

        function UploadFile(file, options, callback) {
            var url = $rootScope.serverHost;
            var uploadInfoRecord = {};
            var recordCount = $scope.uploadInfo.length;
            // create new row in uploadInfo, since upload in async
            $scope.uploadInfo[recordCount] = {};

            if (!file || file.$error) {
                return;
            }

            uploadInfoRecord.fileInfo = file;
            uploadInfoRecord.uploadResult = {};

            uploadInfoRecord.name = file.name;
            uploadInfoRecord.size = file.size;
            uploadInfoRecord.uploadProgress = 0;

            // File Object
            // console.dir(file)
            /*
                lastModified: 1474968722283
                lastModifiedDate: Tue Sep 27 2016 17:32:02 GMT+0800 (China Standard Time)
                name: "hu01ca.xlsx"
                size: 8629
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                upload: d
                webkitRelativePath: ""
            */

            // Upload Result from PHP
            /*
            {
              "name": "hu01ca.xlsx",
              "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "tmp_name": "D:\\xampp\\tmp\\phpDFD9.tmp",
              "error": 0,
              "size": 8629,
              "movedTo": "D:\\xampp\\htdocs\\Develop\\model/../temp/upload/hu01ca.xlsx",
              "fileIntegrity-md5": "3e7992dbabfbc9ea84c621762831975b",
              "fileIntegrity-sha1": "691528b6437c8e686d342eeacd0f27620a6ba295",
              "errorMsg": ""
            }
            */
            
            /*
                var uploadAction = $scope.uploadInstance = Upload.upload({
                  //url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                  url: url+'/archive/2.8.x/controller/documentUploader.for12.2.21.php',
                  data: {file: file},
                });
                */
				var submitData = {
					"Table": "",
					"file": file
				};
				var uploadAction = DataAdapter.UploadData(submitData);
                
                
                // http://api.jquery.com/deferred.then/#deferred-then-doneCallbacks-failCallbacks
                // deferred.then( doneCallbacks, failCallbacks [, progressCallbacks ] )
                uploadAction.then(function (response) {
                    uploadInfoRecord.uploadResult = response.data;
                    //if(response.data.error)
                    //$scope.errorMsg = response.data.error + " - "+response.data.errorMsg

                    $scope.uploadInfo[recordCount] = uploadInfoRecord;
                    // $ctrl.ngModel = $scope.uploadInfo;

                    $scope.uploadResult[$scope.uploadResult.length] = response.data;
                    $ctrl.ngModel = $scope.uploadResult;
                }, function (response) {
                    //if(response.data.error)
                    //$scope.errorMsg = response.data.error + " - "+response.data.errorMsg
                }, function (evt) {
                  // Math.min is to fix IE which reports 200% sometimes
                  var uploadedPercentage = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                  uploadInfoRecord.uploadProgress = uploadedPercentage;
                });

                return uploadAction;
        }

        $scope.UploadData = function(files){
            // console.dir(files)
            UploadFileList(files);
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
            InitializeUpload();
        }

        function InitDirective(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("scope.$id:"+$scope.$id+", may implement $scope.InitDirective() function in webapge");
        }
        function EventListener(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("scope.$id:"+$scope.$id+", may implement $scope.EventListener() function in webapge");
        }
        // function SetDefaultValue(){
        //     console.log("scope.$id:"+$scope.$id+", may implement $scope.SetDefaultValue() function in webapge");
        // }
        function StatusChange(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("scope.$id:"+$scope.$id+", may implement $scope.StatusChange() function in webapge");
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
        require: ['ngModel', '?import'],
        restrict: 'EA', //'EA', //Default in 1.3+
        transclude: true,

        // scope: [false | true | {...}]
        // false = use parent scope
        // true =  A new child scope that prototypically inherits from its parent
        // {} = create a isolate scope
        scope: true,

        controller: UploadConstructor,
        controllerAs: 'uploadCtrl',

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
