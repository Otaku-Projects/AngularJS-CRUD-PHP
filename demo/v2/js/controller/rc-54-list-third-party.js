"use strict";
app.controller('thirdPartyListController', ['$scope', '$state', 'Security', function ($scope, $state, Security, $rootScope) {
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
		var thirdPartyID = sRecord.ThirdPartyID;
		$state.go("rc-54-list-third-party.rc-54-entry-third-party", {thirdPartyID:thirdPartyID} );
	}
}]);
