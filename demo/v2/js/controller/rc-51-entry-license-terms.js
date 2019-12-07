"use strict";
app.controller('licenseEntryController', ['$scope', '$state', 'Security', function ($scope, $state, Security, $rootScope) {
	$scope.directiveScopeDict = {};
    $scope.directiveCtrlDict = {};
	
	$scope.licenseID = $scope.$resolve.licenseID;
	//console.dir($scope);
	//console.dir($state.params);
	
	$scope.licenseID = $state.params.licenseID;
	
    function Initialize(){
        var entryForm = {};

        $scope.entryForm = entryForm;
    }
    Initialize();
	
	$scope.BackToParentState = function(){
		//$state.go('rc-51-list-license-terms');
		$state.go('^');
	}

    $scope.EventListener = function(scope, iElement, iAttrs, controller){
		var tagName = iElement[0].tagName.toLowerCase();
		var prgmID = scope.programId;
		var scopeID = scope.$id;
		var hashID = tagName + '_' + prgmID;

		if($scope.directiveScopeDict[hashID] == null || typeof($scope.directiveScopeDict[hashID]) == "undefined"){
			$scope.directiveScopeDict[hashID] = scope;
			$scope.directiveCtrlDict[hashID] = controller;

		}
		
        iElement.ready(function() {
        })
    }

    $scope.SetDefaultValue = function(scope, iElement, iAttrs, controller){
		var name = "entry_ds50lt"
		$scope.directiveCtrlDict[name].ngModel.LicenseID = $scope.licenseID;
		
		$scope.directiveScopeDict[name].FindData();
    }

    $scope.StatusChange = function(fieldName, newValue, newObj, scope, iElement, iAttrs, controller){
    }

    $scope.ValidateBuffer = function(scope, iElement, iAttrs, controller){
        return true;
    }
}]);
