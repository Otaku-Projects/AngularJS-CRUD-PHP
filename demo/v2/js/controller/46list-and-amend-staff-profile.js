"use strict";
app.controller('staffProfileAmendController', ['$scope', '$element', function($scope, $element, $rootScope) {
    function Initialize() {
        var entryForm = {};
        $scope.entryForm = entryForm;
        $scope.directiveDict = {};

        $scope.deptEditBox = {};
        $scope.sectionEditBox = {};
    }
    Initialize();

    $scope.SetDefaultValue = function(scope, iElement, iAttrs, controller) {
        controller.ngModel.DateOfBirth = new Date(0, 0, 0);
        controller.ngModel.EmploymentDate = new Date(0, 0, 0);
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
        console.log("<" + iElement[0].tagName + ">" + " Directive overried CustomPointedToRecord()");

        var tagName = iElement[0].tagName.toLowerCase();
        var prgmID = scope.programId.toLowerCase();

        if (prgmID == "hw01sm") {
            // asign the selected record to ng-model
            $.extend(true, $scope.entryForm, sRecord)
        }

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