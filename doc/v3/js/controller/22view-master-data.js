"use strict";
app.controller('viewDepartmentController', ['$scope', function ($scope, $rootScope) {
	$scope.deptDataList = [];
	function Initialize(){
		var entryForm = {};
		var entryForm2 = {};

		$scope.entryForm = entryForm;
		$scope.entryForm2 = entryForm;
	}
	Initialize();

	$scope.EventListener = function(scope, iElement, iAttrs, controller){
		console.log("<"+iElement[0].tagName+">" +" Directive overried EventListener()");

		//http://api.jquery.com/Types/#Event
		//The standard events in the Document Object Model are:
		// blur, focus, load, resize, scroll, unload, beforeunload,
		// click, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave,
		// change, select, submit, keydown, keypress, and keyup.
		iElement.ready(function() {

		})
	}

	$scope.SetDefaultValue = function(scope, iElement, iAttrs, controller){
		console.log("<"+iElement[0].tagName+">" +" Directive overried SetDefaultValue()");

//		controller.ngModel.gender = "M";
	}

	$scope.StatusChange = function(fieldName, newValue, newObj, scope, iElement, iAttrs, controller){
		console.log("<"+iElement[0].tagName+">" +" Directive overried StatusChange()");

		if(fieldName == "departmentCode")
			newObj.DepartmentCode = newObj.DepartmentCode.toUpperCase(); 
	}

	$scope.ValidateBuffer = function(scope, iElement, iAttrs, controller){
		console.log("<"+iElement[0].tagName+">" +" Directive overried ValidateBuffer()");
		return true;
	}

	$scope.CustomPointedToRecord = function(pRecord, rowScope, scope, iElement, controller){
		console.log("<"+iElement[0].tagName+">" +" Directive overried CustomPointedToRecord()");
		$scope.entryForm = pRecord;
	}

	$scope.CustomSelectedToRecord = function(sRecord, rowScope, scope, iElement, controller){
		console.log("<"+iElement[0].tagName+">" +" Directive overried CustomPointedToRecord()");
		$scope.entryForm2 = sRecord;
	}
}]);