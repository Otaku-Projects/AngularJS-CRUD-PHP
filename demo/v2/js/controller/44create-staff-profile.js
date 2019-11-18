"use strict";
app.controller('staffProfileCreateController', ['$scope', '$element', function($scope, $element, $rootScope) {
    function Initialize() {
        var entryForm = {};
        $scope.entryForm = entryForm;

        $scope.directiveScopeDict = {};
        $scope.deptEditBox = {};
        $scope.sectionEditBox = {};
    }
    Initialize();

    $scope.SetDefaultValue = function(scope, iElement, iAttrs, controller) {
        controller.ngModel.LastName = "Peter";
        controller.ngModel.FirstName = "Pan";

        controller.ngModel.DateOfBirth = null
        controller.ngModel.EmploymentDate = new Date();
    }

    $scope.StatusChange = function(fieldName, newValue, newObj, scope, iElement, iAttrs, controller) {
        if (fieldName == "StaffID")
            newObj.StaffID = newObj.StaffID.toUpperCase();
    }

    $scope.EventListener = function(scope, iElement, iAttrs, controller) {
        var prgmID = scope.programId;
        var tagName = iElement[0].tagName;
        if ($scope.directiveScopeDict[prgmID] == null || typeof($scope.directiveScopeDict[prgmID]) == "undefined") {
            $scope.directiveScopeDict[prgmID] = scope;
        }
		
        iElement.ready(function() {

        })
    }

    $scope.CustomSelectedToRecord = function(sRecord, rowScope, scope, iElement, controller) {
        var tagName = iElement[0].tagName.toLowerCase();
        var prgmID = scope.programId.toLowerCase();

        if (prgmID == "dw01dp") {
            // asign the selected record to ng-model
            $scope.entryForm.DeptCode = sRecord.DepartmentCode;
        } else if (prgmID == "dw02se") {
            $scope.entryForm.SectionCode = sRecord.SectionCode;
        }

    }

    $scope.ValidateBuffer = function(scope, iElement, iAttrs, controller) {
        controller.ngModel.FullName = controller.ngModel.LastName + ' ' + controller.ngModel.FirstName;

        return true;
    };

}]);