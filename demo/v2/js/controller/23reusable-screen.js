"use strict";
app.controller('reuseController', ['$scope', 'Security', function ($scope, Security, $rootScope) {
    $scope.directiveScopeDict = {};
    function Initialize(){
    }
    Initialize();

    $scope.EventListener = function(scope, iElement, iAttrs, controller){
        var prgmID = scope.programId;
        if($scope.directiveScopeDict[prgmID] == null || typeof($scope.directiveScopeDict[prgmID]) == "undefined"){
          $scope.directiveScopeDict[prgmID] = scope;
        }
		
        iElement.ready(function() {

        })
    }

    $scope.CustomSelectedToRecord = function(sRecord, rowScope, scope, iElement, controller){
    }

    $scope.CustomSubmitDataResult = function(responseObj, httpStatusCode, scope, element, attrs, ctrl){
    }
}]);