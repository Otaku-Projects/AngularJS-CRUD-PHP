"use strict";
app.controller('createDepartmentController', ['$scope', 'Security', function ($scope, Security, $rootScope) {
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
        // controller.ngModel.DepartmentCode = "ABC"
        //controller.ngModel.DepartmentCode = 125
    }

    $scope.StatusChange = function(fieldName, newValue, newObj, scope, iElement, iAttrs, controller){
        if(fieldName == "DepartmentCode")
            newObj.DepartmentCode = newObj.DepartmentCode.toUpperCase(); 
    }

    $scope.ValidateBuffer = function(scope, iElement, iAttrs, controller){
        return true;
    }
}]);
