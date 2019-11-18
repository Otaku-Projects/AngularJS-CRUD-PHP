"use strict";
app.controller('deleteDepartmentController', ['$scope', 'Security', function ($scope, Security, $rootScope) {
$scope.deptDataList = [];
$scope.directiveScopeDict = {};
function Initialize(){
    var entryForm = {};
    $scope.entryForm = entryForm;
}
Initialize();

$scope.EventListener = function(scope, iElement, iAttrs, controller){
    var prgmID = scope.programId;
    if($scope.directiveScopeDict[prgmID] == null || typeof($scope.directiveScopeDict[prgmID]) == "undefined"){
      $scope.directiveScopeDict[prgmID] = scope;
    }
	
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
    //$scope.entryForm = pRecord;
}

$scope.CustomSelectedToRecord = function(sRecord, rowScope, scope, iElement, controller){
    $scope.entryForm = sRecord;
}

$scope.CustomSubmitDataResult = function(responseObj, httpStatusCode, scope, element, attrs, ctrl){
    var prgmID = scope.programId;
    if(prgmID == "ds01dp"){
      $scope.directiveScopeDict["dw01dp"].ClearNRefreshData();
    }
}
}]);