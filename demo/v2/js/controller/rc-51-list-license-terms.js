"use strict";
app.controller('licenseListController', ['$scope', '$state', 'Security', function ($scope, $state, Security, $rootScope) {
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
		
    }

    $scope.ValidateBuffer = function(scope, iElement, iAttrs, controller){
        return true;
    }

	$scope.CustomPointedToRecord = function(pRecord, rowScope, scope, iElement, controller){
	}

	$scope.CustomSelectedToRecord = function(sRecord, rowScope, scope, iElement, controller){
		var licenseID = sRecord.LicenseID;
		$state.go("rc-51-list-license-terms.rc-51-entry-license-terms", {licenseID:licenseID} );
	}
}]);
