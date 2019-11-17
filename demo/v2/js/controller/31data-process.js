"use strict";
app.controller('processController', ['$scope', 'Security', function ($scope, Security, $rootScope) {
    $scope.directiveScopeDict = {};
	$scope.processModel = {};
    $scope.processModel.Record = {};
    
    $scope.ResetUserPwdList = [];

    $scope.EventListener = function(scope, iElement, iAttrs, controller){
        var prgmID = scope.programId;
		var tagName = iElement[0].tagName;
        if($scope.directiveScopeDict[prgmID] == null || typeof($scope.directiveScopeDict[prgmID]) == "undefined"){
          $scope.directiveScopeDict[prgmID] = scope;
        }
		
        iElement.ready(function() {
        })
    }

    $scope.SetDefaultValue = function(scope, iElement, iAttrs, controller){
		$scope.processModel.InquiryCriteria.UserID = "";
		$scope.processModel.InquiryCriteria.LoginID = "";
		$scope.processModel.Record.IsDisabled = "N";
    }

    $scope.StatusChange = function(fieldName, newValue, newObj, scope, iElement, iAttrs, controller){
    }

    $scope.ValidateBuffer = function(scope, iElement, iAttrs, controller){
        var isValid = true;
        $scope.ClearResetUserList();
        
        return isValid;
    }
    
    $scope.ClearResetUserList = function(){
        $scope.ResetUserPwdList = [];
    }

    $scope.CustomPointedToRecord = function(sRecord, rowScope, scope, iElement, controller){
        //$scope.AddUserResetPwdBtn(sRecord);
    }

    $scope.CustomSelectedToRecord = function(sRecord, rowScope, scope, iElement, controller){
        $scope.AddUserResetPwdBtn(sRecord);
    }
    
    $scope.AddUserResetPwdBtn = function(sRecord){
        var addUserID = sRecord.UserID;
        
        // remove user from the inquiry result list
        var inquiryResultUserList =  $scope.processModel.InquiryResult.Data;
        inquiryResultUserList = inquiryResultUserList.filter(function( obj ) {
            return obj.UserID !== addUserID;
        });
        $scope.processModel.InquiryResult.Data = inquiryResultUserList;
        
        // add user to reset list        
        $scope.ResetUserPwdList.push(sRecord);
        
        // set reset list to process criteria
        $scope.processModel.ProcessCriteria = $scope.ResetUserPwdList;
    }
    
    $scope.RemoveUserResetPwdBtn = function(sRecord){
        var removeUserID = sRecord.UserID;
        
        // remove user from the inquiry result list
        var inquiryResultUserList =  $scope.ResetUserPwdList;
        inquiryResultUserList = inquiryResultUserList.filter(function( obj ) {
            return obj.UserID !== removeUserID;
        });
        $scope.ResetUserPwdList = inquiryResultUserList;
        
        // add user to reset list        
        $scope.processModel.InquiryResult.Data.push(sRecord);
        
        // set reset list to process criteria
        $scope.processModel.ProcessCriteria = $scope.ResetUserPwdList;
    }

    $scope.CustomSubmitDataResult = function(responseObj, httpStatusCode, scope, iElement, attrs, ctrl){
        $scope.processModel.InquiryResult.Data = [];
        $scope.ResetUserPwdList = [];
    }
    
    $scope.sorterFunc = function(person){
        return parseInt(person.id);
    };
}]);