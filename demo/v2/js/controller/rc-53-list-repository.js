"use strict";
app.controller('repositoryListController', ['$scope', '$state', 'Security', function ($scope, $state, Security, $rootScope) {
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
		var repositoryID = sRecord.RepositoryID;
		$state.go("rc-53-list-repository.rc-53-entry-repository", {repositoryID:repositoryID} );
	}
}]);
