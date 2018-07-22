"use strict";
  app.controller('staffProfileCreateController', ['$scope', '$element', function ($scope, $element, $rootScope) {
      function Initialize(){
      var entryForm = {};    
      $scope.entryForm = entryForm;
      $scope.directiveDict = {};

      $scope.deptEditBox = {};
      $scope.sectionEditBox = {};
      }
      Initialize();

      $scope.SetDefaultValue = function(scope, iElement, iAttrs, controller){
          // controller.ngModel.StaffID = "";
          controller.ngModel.LastName = "Peter";
          controller.ngModel.FirstName = "Pan";
          // controller.ngModel.ChineseName = "";

          //controller.ngModel.Birthday = new Date(0, 0, 0);
		  controller.ngModel.Birthday = null
          controller.ngModel.EmploymentDate = new Date();
      }

    $scope.StatusChange = function(fieldName, newValue, newObj, scope, iElement, iAttrs, controller){
        if(fieldName == "StaffID")
            newObj.StaffID = newObj.StaffID.toUpperCase(); 
    }

    $scope.EventListener = function(scope, iElement, iAttrs, controller){
      console.log("<"+iElement[0].tagName+">" +" Directive overried EventListener()");
      var prgmID = scope.programId;
      var tagName = iElement[0].tagName.toLowerCase();
      var editMode = "";

      if(tagName == "entry") editMode = iAttrs.editMode;

      console.log(tagName)
      var varName = prgmID;//tagName + prgmID + editMode;
      varName = varName.toLowerCase();

      if($scope.directiveDict[varName] == null || typeof($scope.directiveDict[varName]) == "undefined"){
        $scope.directiveDict[varName] = scope;
      }

      // console.dir(scope);
      // console.dir(iElement);
      // console.dir(iAttrs);
      // console.dir(controller);

      //http://api.jquery.com/Types/#Event
      //The standard events in the Document Object Model are:
      // blur, focus, load, resize, scroll, unload, beforeunload,
      // click, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave,
      // change, select, submit, keydown, keypress, and keyup.
      iElement.ready(function() {

      })
    }

    $scope.CustomSelectedToRecord = function(sRecord, rowScope, scope, iElement, controller){
        console.dir(iElement)
      console.log("<"+iElement[0].tagName+">" +" Directive overried CustomPointedToRecord()");

      var tagName = iElement[0].tagName.toLowerCase();
      var prgmID = scope.programId.toLowerCase();

      if(prgmID == "dw01dp"){
        // asign the selected record to ng-model
        $scope.deptEditBox = sRecord;
        $scope.entryForm.DeptCode = sRecord.DepartmentCode;
      }

      else if (prgmID == "dw02se"){
        $scope.sectionEditBox = sRecord;
        $scope.entryForm.SectionCode = sRecord.SectionCode; 
      }

    }

    $scope.ValidateBuffer = function(scope, iElement, iAttrs, controller){
      controller.ngModel.FullName = controller.ngModel.LastName + ' ' +  controller.ngModel.FirstName;

      return true;
    };

  }]);