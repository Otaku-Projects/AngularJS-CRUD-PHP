"use strict";
  app.controller('staffProfileAmendController', ['$scope', function ($scope, $rootScope) {
      function Initialize(){
      var entryForm = {};    
      $scope.entryForm = entryForm;
      $scope.directiveDict = {};

      $scope.deptEditBox = {};
      $scope.sectionEditBox = {};
      }
      Initialize();

      $scope.SetDefaultValue = function(scope, iElement, iAttrs, controller){
          // entryForm.StaffID = "";
          // entryForm.Surname = "";
          // entryForm.GivenName = "";
          // entryForm.ChineseName = "";

      controller.ngModel.DateOfBirth = new Date(0, 0, 0);
      controller.ngModel.EmployeeDate = new Date(0, 0, 0);
      }

    $scope.EventListener = function(scope, iElement, iAttrs, controller){
      console.log("<"+iElement[0].tagName+">" +" Directive overried EventListener()");
      var prgmID = scope.programId;
      var tagName = iElement[0].tagName.toLowerCase();
      var editMode = "";

      if(tagName == "entry") editMode = iAttrs.editMode;

      if(!prgmID)
        return;

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
      console.log("<"+iElement[0].tagName+">" +" Directive overried CustomPointedToRecord()");

      var tagName = iElement[0].tagName.toLowerCase();
      var prgmID = scope.programId.toLowerCase();

      if(prgmID == "hw01sm"){
        // asign the selected record to ng-model
        $.extend(true, $scope.entryForm, sRecord)
      }

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