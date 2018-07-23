// JavaScript Document
"use strict";

//angular.element() === jQuery() === $();
// using the angular ui of Bootstrap
var app = angular.module('myApp', ['ngCookies', 'ngFileUpload']);

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
		// scope: {
			// oneWay: '@',
			// twoWay: '=',
            // expr: '&
		// }
        scope: true,

        controller: ImportExportConstructor,
		controllerAs: 'imExCtrl',
		
        //If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
        bindToController: {
        someObject: '=',
        someString: '@',
        someExpr: '&'
        }
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