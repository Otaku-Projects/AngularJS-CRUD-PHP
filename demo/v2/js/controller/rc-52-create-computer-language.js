"use strict";
app.controller('computerLanguageCreateController', ['$scope', '$state', 'Security', function ($scope, $state, Security, $rootScope) {
    function Initialize(){
        var entryForm = {};

        $scope.entryForm = entryForm;
    }
    Initialize();
	
	$scope.BackToParentState = function(){
		$state.go('rc-52-list-computer-language');
	}

    $scope.EventListener = function(scope, iElement, iAttrs, controller){
        iElement.ready(function() {

        })
    }

    $scope.SetDefaultValue = function(scope, iElement, iAttrs, controller){
		
    }

    $scope.StatusChange = function(fieldName, newValue, newObj, scope, iElement, iAttrs, controller){
        if(fieldName == "ShortForm")
            newObj.ShortForm = newObj.ShortForm.toUpperCase(); 
    }

    $scope.ValidateBuffer = function(scope, iElement, iAttrs, controller){
        return true;
    }
}]);
