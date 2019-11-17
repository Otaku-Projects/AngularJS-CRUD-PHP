"use strict";
app.controller('rangeController', ['$scope', 'Security', function ($scope, Security, $rootScope) {
    $scope.directiveScopeDict = {};
    function Initialize(){
        $scope.deptRange = {};
        $scope.deptRange2 = {};
    }
    Initialize();

    $scope.EventListener = function(scope, iElement, iAttrs, controller){
        console.log("<"+iElement[0].tagName+">" +" Directive overried EventListener()");
        var prgmID = scope.programId;
		var tagName = iElement[0].tagName;
        if($scope.directiveScopeDict[prgmID] == null || typeof($scope.directiveScopeDict[prgmID]) == "undefined"){
          $scope.directiveScopeDict[prgmID] = scope;
        }
		
        iElement.ready(function() {
        })
    }

    $scope.SetDefaultValue = function(scope, iElement, iAttrs, controller){
    }

    $scope.StatusChange = function(fieldName, newValue, newObj, scope, iElement, iAttrs, controller){
    }

    $scope.ValidateBuffer = function(scope, iElement, iAttrs, controller){
        return true;
    }

    $scope.CustomSelectedToRecord = function(sRecord, rowScope, scope, iElement, controller){
    }

    $scope.CustomSubmitDataResult = function(responseObj, httpStatusCode, scope, element, attrs, ctrl){
    }
}]);