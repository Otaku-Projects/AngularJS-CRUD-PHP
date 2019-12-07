"use strict";
app.controller('thirdPartyEntry2CreateController', ['$scope', '$state', 'Security', 'MessageService', function ($scope, $state, Security, MessageService) {
	$scope.directiveScopeDict = {};
    $scope.directiveCtrlDict = {};
	
    function Initialize(){
        var processForm = {};

        $scope.processForm = processForm;
		$scope.processForm.Record = {};
    }
    Initialize();
	
	$scope.BackToParentState = function(){
		$state.go('rc-55-list-third-party');
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
				$scope.ResetForm();
			}
        })
    }
	
	$scope.GetThirdPartyRecord = function(){
		var name = "process_dp54tp"
		
		$scope.directiveCtrlDict[name].ngModel.InquiryCriteria.Action = "create";
		
		$scope.directiveScopeDict[name].InquiryData();
	}
	$scope.ResetForm = function(){
		var name = "process_dp54tp"
		$scope.directiveCtrlDict[name].ngModel.ProcessRecord = {Name: ""};
	}

    $scope.SetDefaultValue = function(scope, iElement, iAttrs, controller){
		
    }

    $scope.StatusChange = function(fieldName, newValue, newObj, scope, iElement, iAttrs, controller){
    }

    $scope.ValidateBuffer = function(scope, iElement, iAttrs, controller){
        return true;
    }
	$scope.CustomInquiryDataResult = function(responseObj, httpStatusCode, scope, iElement, attrs, ctrl){
		if(responseObj.data.computerLanguage.num_rows){
			/*
			ctrl.ThirdParty = responseObj.data.thirdParty.data[0];
			
			ctrl.ngModel.ProcessRecord = ctrl.ThirdParty;
			*/
			console.dir(scope)
			console.dir(ctrl)
			//ctrl.ngModel.ProcessRecord = Object.assign({}, ctrl.ThirdParty);
			//ctrl.ngModel.ProcessRecord = ctrl.ThirdParty;
			ctrl.ngModel.ProcessCriteria.ThirdPartyLang = [];
			
			ctrl.ThirdPartyLang = responseObj.data.thirdPartyLang.data;
			ctrl.ComputerLanguage = ExtractComputerLang(responseObj.data.computerLanguage.data, responseObj.data.thirdPartyLang.data);
			ctrl.ngModel.ProcessCriteria.ThirdPartyLang = ExtractThirdPartyLang(responseObj.data.computerLanguage.data, responseObj.data.thirdPartyLang.data);
		}
		
	}
	
	function ExtractComputerLang(comLangRows, thirdPartyLang){
		var name = "process_dp54tp";
		var ctrl = $scope.directiveCtrlDict[name];
		
		var langArray = comLangRows.slice();
		
		// use forEach() will actual update the array
		langArray.forEach(comLangObj => {
			comLangObj.isSelect = false;
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
	
	$scope.CreateData = function(){
		var name = "process_dp54tp";
		var scope = $scope.directiveScopeDict[name];
		var ctrl = $scope.directiveCtrlDict[name];
		ctrl.ngModel.ProcessCriteria.Editmode = "create";
		scope.SubmitData();
	}
	
	$scope.CustomSubmitDataResult = function(responseObj, httpStatusCode, scope, iElement, attrs, ctrl){
		//$scope.GetThirdPartyRecord();
		
		if(responseObj.status == "success"){
			$scope.ResetForm();
			//$scope.GetThirdPartyRecord();
			
			ctrl.ComputerLanguage.forEach(comLangObj => {
				comLangObj.isSelect = false;
			});
			ctrl.ngModel.ProcessCriteria.ThirdPartyLang = [];
		}
	}
}]);
