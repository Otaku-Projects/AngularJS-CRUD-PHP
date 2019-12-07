"use strict";
app.controller('thirdPartyEntry2EntryController', ['$scope', '$state', 'Security', function ($scope, $state, Security, $rootScope) {
	$scope.directiveScopeDict = {};
    $scope.directiveCtrlDict = {};
	
	$scope.thirdPartyID = $state.params.thirdPartyID;
	
    function Initialize(){
        var processForm = {};

        $scope.processForm = processForm;
		$scope.processForm.Record = {};
    }
    Initialize();
	
	$scope.BackToParentState = function(){
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
			if(tagName=="process"){
				$scope.GetThirdPartyRecord();
			}
        })
    }
	
	$scope.GetThirdPartyRecord = function(){
		var name = "process_dp54tp"
		$scope.directiveCtrlDict[name].ngModel.Record.ThirdPartyID = $scope.thirdPartyID;
		$scope.directiveCtrlDict[name].ngModel.InquiryCriteria.Action = "amend";
	
		$scope.directiveScopeDict[name].InquiryData();
	}

    $scope.SetDefaultValue = function(scope, iElement, iAttrs, controller){
		
    }

    $scope.StatusChange = function(fieldName, newValue, newObj, scope, iElement, iAttrs, controller){
    }

    $scope.ValidateBuffer = function(scope, iElement, iAttrs, controller){
        return true;
    }
	$scope.CustomInquiryDataResult = function(responseObj, httpStatusCode, scope, iElement, attrs, ctrl){
		if(responseObj.data.thirdParty.num_rows){
			ctrl.ThirdParty = responseObj.data.thirdParty.data[0];
			
			ctrl.ngModel.ProcessRecord = ctrl.ThirdParty;
			ctrl.ngModel.ProcessCriteria.ThirdPartyLang = [];
			
			if(responseObj.data.computerLanguage.num_rows){
				ctrl.ThirdPartyLang = responseObj.data.thirdPartyLang.data;
				ctrl.ComputerLanguage = ExtractComputerLang(responseObj.data.computerLanguage.data, responseObj.data.thirdPartyLang.data);
				ctrl.ngModel.ProcessCriteria.ThirdPartyLang = ExtractThirdPartyLang(responseObj.data.computerLanguage.data, responseObj.data.thirdPartyLang.data);
			}
		}
		
	}
	
	function ExtractComputerLang(comLangRows, thirdPartyLang){
		var name = "process_dp54tp";
		var ctrl = $scope.directiveCtrlDict[name];
		
		var langArray = comLangRows.slice();
		
		// use forEach() will actual update the array
		langArray.forEach(comLangObj => {
			var thirdPartLangObj = thirdPartyLang.filter(x => x.LanguageID === comLangObj.LanguageID);
			
			// if exist in thirdPartyLang set true
			if(Object.keys(thirdPartLangObj).length === 0){
				comLangObj.isSelect = false;
			}else{
				comLangObj.isSelect = true;
			}
		});
		return langArray;
	}
	
	function ExtractThirdPartyLang(comLangRows, thirdPartyLang){
		var name = "process_dp54tp";
		var ctrl = $scope.directiveCtrlDict[name];
		
		var langArray = comLangRows.slice();
		
		// use forEach() will actual update the array
		langArray.forEach(comLangObj => {
			var thirdPartLangObj = thirdPartyLang.filter(x => x.LanguageID === comLangObj.LanguageID);
			
			// if exist in thirdPartyLang, assign to processCriteria
			if(Object.keys(thirdPartLangObj).length === 0){
			}else{
				comLangObj.isSelect = true;
				//ctrl.ngModel.ProcessCriteria.ThirdPartyLang.push(comLangObj);
			}
		});
		var selectedLangArray = langArray.filter(x => x.isSelect == true);
		return selectedLangArray;
	}
	
	$scope.ToggleThirdPartyLang = function(comLangRow){
		var name = "process_dp54tp";
		var ctrl = $scope.directiveCtrlDict[name];
		var thirdPartyLangArray = ctrl.ngModel.ProcessCriteria.ThirdPartyLang;
		comLangRow.isSelect = !comLangRow.isSelect;
		
		// remove from ProcessCriteria
		var selectedLangArray = thirdPartyLangArray.filter(x => x.LanguageID != comLangRow.LanguageID);
		
		// add to ProcessCriteria
		if(comLangRow.isSelect){
			selectedLangArray.push(comLangRow);
		}
		
		ctrl.ngModel.ProcessCriteria.ThirdPartyLang = selectedLangArray;
	}
	
	$scope.UpdateData = function(){
		var name = "process_dp54tp";
		var scope = $scope.directiveScopeDict[name];
		var ctrl = $scope.directiveCtrlDict[name];
		ctrl.ngModel.ProcessCriteria.Editmode = "amend";
		scope.SubmitData();
	}
	
	$scope.DeleteData = function(){
		var name = "process_dp54tp";
		var scope = $scope.directiveScopeDict[name];
		var ctrl = $scope.directiveCtrlDict[name];
		ctrl.ngModel.ProcessCriteria.Editmode = "delete";
		
		scope.SubmitData();
	}
	
	$scope.CustomSubmitDataResult = function(responseObj, httpStatusCode, scope, iElement, attrs, ctrl){
		//$scope.GetThirdPartyRecord();
		var editmode = ctrl.ngModel.ProcessCriteria.Editmode;
		
		if(editmode == "delete"){
			if(responseObj.status == "success"){
				$scope.BackToParentState();
			}
		}
	}
	
}]);
