"use strict";
app.controller('viewDepartmentController', ['$scope', 'Security', function ($scope, Security, $rootScope) {
	$scope.previousSelectedRecord = {};
	$scope.previousPointedRecord = {};
	
    function Initialize(){
        var entryForm = {};

        $scope.entryForm = entryForm;
    }
    Initialize();

    $scope.EventListener = function(scope, iElement, iAttrs, controller){
        iElement.ready(function() {

        })
    }

    $scope.SetDefaultValue = function(scope, iElement, iAttrs, controller){
    }

    $scope.StatusChange = function(fieldName, newValue, newObj, scope, iElement, iAttrs, controller){
        if(fieldName == "DepartmentCode")
            newObj.DepartmentCode = newObj.DepartmentCode.toUpperCase(); 
    }

    $scope.ValidateBuffer = function(scope, iElement, iAttrs, controller){
        return true;
    }

    $scope.CustomSelectedToRecord = function(sRecord, rowScope, scope, iElement, controller){
        // asign the selected record to ng-model
        $scope.entryForm.DeptCode = sRecord.DepartmentCode;
		$scope.previousSelectedRecord = sRecord;
    }

    $scope.CustomPointedToRecord = function(sRecord, rowScope, scope, iElement, controller){
		// asign the pointed record to ng-model
		$scope.entryForm.DeptCode = sRecord.DepartmentCode;
		$scope.previousPointedRecord = sRecord;
    }
}]);
