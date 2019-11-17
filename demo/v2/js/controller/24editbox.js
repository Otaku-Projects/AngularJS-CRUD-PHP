"use strict";
app.controller('editboxController', ['$scope', 'Security', function ($scope, Security, $rootScope) {
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