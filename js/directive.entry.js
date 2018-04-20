// JavaScript Document
"use strict";

/**
 * <entry> a entry form use to provide Create/Read/Update/Delete behavior of a single table
 * <entry
    ng-model=""
    program-id=""
    edit-mode=""
    >
 * @param {Object} ng-model - store the data record, the data record may used in CRUD
 * @param {String} program-id - assign the program id to implement the behavior of CRUD
 * @param {String} edit-mode - define the mode [create | view | amend | delete |]
 */
app.directive('entry', ['$rootScope',
    '$q',
    '$timeout',
    '$compile',
    'Core',
    'Security',
    'LockManager',
    'LoadingModal',
    'HttpRequeset',
    'MessageService',
    'ThemeService',
    'TableManager',
    'DataAdapter', function($rootScope, $q, $timeout, $compile, Core, Security, LockManager, LoadingModal, HttpRequeset, MessageService, ThemeService, TableManager, DataAdapter) {
    function EntryConstructor($scope, $element, $attrs) {
    	var constructor = this;
    	var $ctrl = $scope.entryCtrl;
        var tagName = $element[0].tagName.toLowerCase();

    	var globalCriteria = $rootScope.globalCriteria;
        var backupNgModelObj = {};

        var DirectiveProperties = (function () {
            var editMode;
            var programID;

            function findEditMode() {
                var object = $scope.editMode = FindEditModeEnum($attrs.editMode);
                return object;
            }
            function findProgramID(){
                var object = $attrs.programId;
                return object;
            }

            return {
                getEditMode: function () {
                    if (!editMode) {
                        editMode = findEditMode();
                    }
                    return editMode;
                },
                getProgramID: function(){
                    var isProgramIdFound = false;
                    if(!programID){
                        programID = findProgramID;
                    }
                    if(typeof(programID) != undefined){
                        if(programID != null && programID !=""){
                            isProgramIdFound = true;
                        }
                    }

                    if(isProgramIdFound){
                        $scope.programId = $attrs.programId;
                    }
                    else
                        alert("<entry> Must declare a attribute of program-id");
                }
            };
        })();

        function InitializeEntry() {
        	$scope.tableStructure = {};
            DirectiveProperties.getEditMode();
            DirectiveProperties.getProgramID();

            $scope.DisplayMessageList = MessageService.getMsg();
        }

        $scope.BackupNgModel = function(){ BackupNgModel(); }
        $scope.RestoreNgModel = function(){ RestoreNgModel(); }
        $scope.FindNClearChildEditbox = function(){ FindNClearChildEditbox(); }

        function BackupNgModel(){
            backupNgModelObj = jQuery.extend({}, $ctrl.ngModel);
        }

        function RestoreNgModel(){
            // 20170108, keithpoon, must use option 2, otherwise will break the StatusChange of the watch listener
            // Option 1 will stick the ngModel with the defaulted value object
            // Option 2 will keep the customized value on the page, such is the prefered language setting

            // Option 1: clone the default object as ngModel
//            $ctrl.ngModel = angular.copy(backupNgModelObj);

            // Option 2: append and overwrite the default value on ngModel
             jQuery.extend(true, $ctrl.ngModel, backupNgModelObj);
        }

        // 20170108, keithpoon, add: clear editbox after record created
        function FindNClearChildEditbox(){
            /*Get the elements with the attribute ng-model, in your case this could just be elm.children()*/
            var elms = [].slice.call($element[0].querySelectorAll('editbox[ng-model]'), 0);

            // get the ngModelControllerArray
            // var controllers = elms.map(function(el){
            //   return angular.element(el).controller('ngModel');
            // });
            var scopes = elms.map(function(el){
              return angular.element(el).scope();
            });

            scopes.forEach(function(editboxScope){
                editboxScope.ClearEditboxNgModel();
            });
        }

        $scope.ResetForm = function(){
            $scope.RestoreNgModel();
            $scope.FindNClearChildEditbox();
        }

		$scope.SetNgModel = function(dataRecord){
			var dataJson = {};
			//dataJson.data = {};
			//dataJson.data.Items = [];
			//dataJson.data.Items[1] = dataRecord;
			//console.dir(dataJson)
			//SetNgModel(dataJson);
			SetNgModel(dataRecord);
		}

        function SetNgModel(dataJson){
            var dataColumns = $scope.tableStructure.DataColumns;
            var keyColumns = $scope.tableStructure.KeyColumns;

            var dataRecord = dataJson.ActionResult.data[0];

        	for(var columnName in dataColumns){
        		var column = dataColumns[columnName];
        		var colDataType = column.type;

                var isSystemField = Core.IsSystemField(columnName);
                if(isSystemField)
                    continue;

                var newColumn = dataRecord[columnName];
                var dataValue = dataRecord[columnName];

//        		// is column exists in ngModel
        		if(typeof(dataValue) == "undefined" || !dataValue){
        			if(colDataType == "string"){
        				dataValue = "";
        			}
        			else if (colDataType == "date"){
        				dataValue = new Date(0, 0, 0);
        			}
        			else if (colDataType == "double"){
        				dataValue = 0.0;
        			}
        		}

        		if (colDataType == "date"){
                    if(typeof dataValue == "string"){
                        var dateArray = dataValue.split("-");
                        var year = dateArray[0]; var month = dateArray[1]; var day = dateArray[2];
                        year = parseInt(year);
                        month = parseInt(month);
                        day = parseInt(day);
                        newColumn = new Date(year, month, day);
                    }else{
                        newColumn = dataValue;
                    }
    			}
    			else if (colDataType == "double"){
    				newColumn = parseFloat(dataValue);
    			}
//    			else{
//    				newColumn = items[colIndex];
//    			}

                $ctrl.ngModel[columnName] = newColumn;
        	}

        }
        function GetTableStructure(){
        	var programId = $scope.programId.toLowerCase();
			var submitData = {
				"Table": programId
			};

            var tbResult = TableManager.GetTableStructure(submitData);
            tbResult.then(function(responseObj) {
                if(Core.GetConfig().debugLog.DirectiveFlow)
                    console.log("ProgramID: "+programId+", Table structure obtained.")
                SetTableStructure(responseObj);
            }, function(reason) {

            }).finally(function() {
                // Always execute this on both error and success
            });

            return tbResult;
        }
        function SetTableStructure(dataJson){
            $scope.tableStructure.DataColumns = dataJson.DataColumns;
            $scope.tableStructure.KeyColumns = dataJson.KeyColumns;
            $scope.tableSchema = dataJson.TableSchema;
        	var itemsColumn = $scope.tableStructure.DataColumns;

            if($ctrl.ngModel == null)
                $ctrl.ngModel = {};

        	for(var colIndex in itemsColumn){
        		var columnName = colIndex;
                var colDataType = itemsColumn[columnName].type;

        		var isSystemField = Core.IsSystemField(columnName);

        		if(isSystemField)
        			continue;

        		var isScopeColExists = true;
        		var colObj;

        		// scope did not defined this column
        		if($ctrl.ngModel == null){
        			isScopeColExists = false;
        		}
        		else if(typeof($ctrl.ngModel[columnName]) == "undefined")
        		{
        			isScopeColExists = false;
        		}

    			if(colDataType == "string"){
    				colObj = "";
    			}
    			else if (colDataType == "date"){
    				colObj = new Date(0, 0, 0);
    			}
    			else if (colDataType == "double"){
    				colObj = 0.0;
    			}

    			if(!isScopeColExists){

    			}else{

    				// if the data type equal
    				if(typeof($ctrl.ngModel[columnName]) === typeof(colObj)){
                        // if the scope already per-defined some value before GetTableStructure() and SetDefaultValue()
                        if($ctrl.ngModel[columnName] != colObj)
    					   colObj = $ctrl.ngModel[columnName];
    				}else{
    					console.warn("The pre-defined default value data type not match of the table structure");
    					console.warn("ProgramID: "+$scope.programId +
    						", colName:"+columnName+
    						", colDataType:"+colDataType+
    						", $ctrl.ngModel:"+$ctrl.ngModel[columnName]);
    				}
    			}

    			//$scope[columnName] = colObj;

    			$ctrl.ngModel[columnName] = colObj;
        	}
        }

        function ConvertKeyFieldToUppercase(recordObj, isRemoveNonKeyField){
            var isKeyValid = true;
            var upperRecordObj = {};

            var tbStructure = $scope.tableStructure;
            var itemsColumn = tbStructure.DataColumns;

            if(typeof(itemsColumn) == "undefined"){
                return recordObj;
            }

            if(typeof(isRemoveNonKeyField) == "undefined" || isRemoveNonKeyField == null)
                var isRemoveNonKeyField = false;

            var keyColumnList = tbStructure.KeyColumns;

            for(var keyIndex in keyColumnList){
                var colName = keyColumnList[keyIndex];
                var keyColIndex = 0;
                var colDataType = "";

                // key column in table structure not match with param
                if(!recordObj.hasOwnProperty(colName)){
                    isKeyValid = false;
                    break;
                }else{
                    upperRecordObj[colName] = recordObj[colName];
                }

                // find the key column data type
                for(var colNameIndex in itemsColumn){
                    if(colName == itemsColumn[colNameIndex])
                    {
                        keyColIndex = colNameIndex
                        break;
                    }
                }
                colDataType = itemsColumn[colName].type;

                // convert to upper case if the key column is a string data type
                if(colDataType == "string"){
                    upperRecordObj[colName] = upperRecordObj[colName].toUpperCase();
                }
            }

            // if(!isKeyValid){
            //     console.log("Avoid to FindData(), upperRecordObj was incomplete.");
            //     return;
            // }

            if(!isRemoveNonKeyField){
                for(var colName in recordObj){
                    if(!upperRecordObj.hasOwnProperty(colName)){
                        upperRecordObj[colName] = recordObj[colName];
                    }
                }
            }

            return upperRecordObj;
        }

        function TryToCallInitDirective(){
            if(typeof $scope.InitDirective == "function"){
                $scope.InitDirective($scope, $element, $attrs, $ctrl);
            }else{
                $scope.DefaultInitDirective();
            }
        }
        $scope.Initialize = function(){
            $scope.InitScope();
            if(typeof $scope.EventListener == "function"){
                $scope.EventListener($scope, $element, $attrs, $ctrl);
            }else{
                EventListener();
            }
            TryToCallInitDirective();
        }
        $scope.InitScope = function(){
            InitializeEntry();
        }
        $scope.DefaultInitDirective = function(){
            var getTableStructurePromiseResult = GetTableStructure();
            getTableStructurePromiseResult.then(function(){
                // the controls inside the directive was locked in the post render
                if($scope.editMode == globalCriteria.editMode.Create){
                    TryToCallSetDefaultValue();
                }
                $scope.BackupNgModel();
                if($scope.editMode != globalCriteria.editMode.Delete && $scope.editMode != globalCriteria.editMode.View)
                    $scope.UnLockAllControls();
            });

        }

        /**
         * Find a record by key value
         * @param {Object} tempKeyObj - provide keyObj to find the specified record
         */
        $scope.FindData = function(){
            var clientID = Security.GetSessionID();
            var programId = $scope.programId.toLowerCase();

            var tempKeyObj = $ctrl.ngModel;

            var isAllKeyExists = IsKeyInDataRow(tempKeyObj);
            if(!isAllKeyExists){
                return;
            }

            var isKeyValid = true;
            var keyObj = {};
            keyObj = ConvertKeyFieldToUppercase(tempKeyObj, true);

            if(!keyObj)
                isKeyValid = false;

            if(!isKeyValid){
                console.log("Avoid to FindData(), keyObj was incomplete.");
                return;
            }

        	var findObj = {
        		"Header":{}
        	}
        	findObj.Header[1] = {};
            findObj.Header[1] = keyObj;

			var submitData = {
				"Table": programId,
				"Data": findObj
			};

            var request = DataAdapter.FindData(submitData); 

    //         var request = HttpRequeset.send(requestOption);
    //         request.then(function(responseObj) {
    //             var data_or_JqXHR = responseObj.data;
    //             // need to handle if record not found.
				// SetNgModel(data_or_JqXHR);
    //         }, function(reason) {
    //           console.error("Fail in FindData() - "+tagName + ":"+$scope.programId)
    //           Security.HttpPromiseFail(reason);
    //         }).finally(function() {
    //         });
            return request;
        }

        $scope.SubmitData = function(){
        	console.log("<"+$element[0].tagName+"> submitting data")
            var globalCriteria = $rootScope.globalCriteria;

        	$scope.LockAllControls();

            if(!ValidateSubmitData()){
                return;
            }

            $scope.ShowLoadModal();
            SubmitData();
        }

        function ValidateSubmitData(){
            var isValid = true;
        	var editMode = DirectiveProperties.getEditMode();

        	// if Buffer invalid, cannot send request
        	var isBufferValid = true;
			if(typeof $scope.ValidateBuffer == "function"){
				isBufferValid = $scope.ValidateBuffer($scope, $element, $attrs, $ctrl);
			}else{
				isBufferValid = ValidateBuffer();
			}
            isValid = isValid && isBufferValid;
			if(!isBufferValid && editMode != globalCriteria.editMode.Delete){
                if(editMode == globalCriteria.editMode.Create ||
                    editMode == globalCriteria.editMode.Amend)
                $scope.UnLockAllControls();
            }

            var tbStructure = ValidateTableStructure();
            isValid = isValid && tbStructure;

            return isValid;
        }
        function SubmitData(){
            var httpResponseObj = {};
            var submitPromise;
        	var editMode = DirectiveProperties.getEditMode();
            var msg = "";

			if(editMode == globalCriteria.editMode.Create){
				if(typeof $scope.CreateData == "function"){
	            	submitPromise = $scope.CreateData($ctrl.ngModel, $scope, $element, $attrs, $ctrl);
	            }else{
	            	submitPromise = CreateData($ctrl.ngModel);
	            }

                submitPromise.then(function(responseObj) {
                    httpResponseObj = responseObj;
                    msg = responseObj.message;
                    if(responseObj.status){
                        //
                        console.dir("CreateData response: "+responseObj.status+", reset form")
                        $scope.ResetForm();
                    }
                }, function(reason) {
                  console.error(tagName + ":"+$scope.programId + " - Fail in CreateData()")
                  throw reason;
                });
			}
			else if(editMode == globalCriteria.editMode.Amend){
				if(typeof $scope.UpdateData == "function"){
	            	submitPromise = $scope.UpdateData($ctrl.ngModel, $scope, $element, $attrs, $ctrl);
	            }else{
	            	submitPromise = UpdateData($ctrl.ngModel);
	            }

                submitPromise.then(function(responseObj) {
                    httpResponseObj = responseObj;
                    msg = responseObj.message;

                    // the lastUpdateDate was changed after record updated, user cannot click the Amend button again.
                    // reget the record or clean the record
//                    $scope.ResetForm();
                    $scope.FindData();

                }, function(reason) {
                  console.error(tagName + ":"+$scope.programId + " - Fail in UpdateData()")
                  throw reason;
                })
			}
			else if(editMode == globalCriteria.editMode.Delete){
				if(typeof $scope.DeleteData == "function"){
	            	submitPromise = $scope.DeleteData($ctrl.ngModel, $scope, $element, $attrs, $ctrl);
	            }else{
	            	submitPromise = DeleteData($ctrl.ngModel);
	            }
                submitPromise.then(function(responseObj) {
                    httpResponseObj = responseObj;
                    msg = responseObj.message;

                    $scope.ResetForm();
                    SetTableStructure($scope.tableStructure);
                }, function(reason) {
                  console.error(tagName + ":"+$scope.programId + " - Fail in DeleteData()")
                  throw reason;
                })
			}

            submitPromise.catch(function(e){
                // handle errors in processing or in error.
                console.log("Submit data error catch in entry");
                Security.HttpPromiseFail(e);
            }).finally(function() {
                // Always execute unlock on both error and success
                $scope.UnLockAllControls();
                $timeout(function() {
                    $scope.HideLoadModal();
                }, 200);
                
                MessageService.addMsg(msg);
                SubmitDataResult(httpResponseObj, httpResponseObj.status);

                if(typeof $scope.CustomSubmitDataResult == "function"){
                    $scope.CustomSubmitDataResult(httpResponseObj,
                        httpResponseObj.status,
                        $scope,
                        $element,
                        $attrs,
                        $ctrl);
                }
            }).catch(function(e){
                // handle errors in processing or in error.
                console.warn(e)
            })

            return submitPromise;
        }
        $scope.LockAllControls = function(){
            LockAllControls();
        }
        $scope.LockAllInputBox = function(){
            LockAllInputBox();
        }
        $scope.UnLockSubmitButton = function(){
            UnLockSubmitButton();
        }
        $scope.UnLockAllControls = function(){
			$timeout(function(){
        		UnLockAllControls();
			  	}, 2000); // (milliseconds),  1s = 1000ms
        }

        $scope.ShowLoadModal = function(){
            LoadingModal.showModal();
        }
        $scope.HideLoadModal = function(){
            LoadingModal.hideModal();
        }

        // StatusChange() event listener
		$scope.$watch(
		  // This function returns the value being watched. It is called for each turn of the $digest loop
		  function() { return $ctrl.ngModel; },
		  // This is the change listener, called when the value returned from the above function changes
		  function(newValue, oldValue) {
		  	var changedField = "";
		  	var changedValue;

		    if ( newValue !== oldValue ) {
		    	for(var colIndex in $ctrl.ngModel){
	    			changedField = colIndex;
                    changedValue = newValue[colIndex];
	    			if(oldValue!=null){
	    				if ( Object.prototype.hasOwnProperty ) {
			    			if(oldValue.hasOwnProperty(colIndex))
			    			{
                              if(oldValue[colIndex] === newValue[colIndex]){
                                //   console.log("continue, old value === new value");
                                  continue;
                              }
                              if(oldValue[colIndex] == newValue[colIndex]){
                                // console.log("continue, old value == new value");
                                  continue;
                              }
                              // 20180419, if it is a object
                              if(typeof oldValue[colIndex] == "object" && typeof newValue[colIndex] == "object"){
                                //   console.warn("check date object euqal")
                                  if(typeof (oldValue[colIndex].getMonth) === 'function'){
                                      // 20170809, if it is a date object, compare with getTime()
                                    if(typeof (oldValue[colIndex].getMonth) === 'function' && typeof (newValue[colIndex].getMonth) === 'function'){
                                        if(oldValue[colIndex].getTime() === newValue[colIndex].getTime()){
                                            // console.log("continue, oldDate === newDate");
                                            continue;
                                        }
                                    }
                                  }else{
                                      // if it is a object with some properties
                                  }
                              }
			    			}
		    			}
	    			}

            // Convert to Uppercase, if the chagned field is a Key and data type is string
            // newValue = ConvertKeyFieldToUppercase(newValue, false);

  					if(typeof $scope.StatusChange == "function"){
  						$scope.StatusChange(colIndex, changedValue, newValue, $scope, $element, $attrs, $ctrl);
  					}else{
  						StatusChange();
  					}
		    	}
		    }
		  },
		  true
		);

        function LockAllControls(){
            LockManager.LockAllControls($element, tagName);
        }
        function UnLockAllControls(){
            LockManager.UnLockAllControls($element, tagName);
        }
        function LockAllInputBox(){
            LockManager.LockAllInputBox($element, tagName);
        }
        function UnLockSubmitButton(){
            LockManager.UnLockSubmitButton($element, tagName);
        }

        function TryToCallSetDefaultValue(){
            if(typeof $scope.SetDefaultValue == "function"){
                $scope.SetDefaultValue($scope, $element, $attrs, $ctrl);
            }else{
                SetDefaultValue();
            }
        }

        function TryToCallIsLimitModelStrictWithSchema(){
            var isLimitModelStrictWithSchema = false;
            if(typeof $scope.IsLimitModelStrictWithSchema == "function"){
                isLimitModelStrictWithSchema = $scope.IsLimitModelStrictWithSchema($scope, $element, $attrs, $ctrl);
            }else{
                isLimitModelStrictWithSchema = IsLimitModelStrictWithSchema();
            }
            return isLimitModelStrictWithSchema;
        }

        function InitDirective(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("scope.$id:"+$scope.$id+", may implement $scope.InitDirective() function in webapge");
        }
		function EventListener(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
			console.log("scope.$id:"+$scope.$id+", may implement $scope.EventListener() function in webapge");
		}
		function SetDefaultValue(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
			console.log("scope.$id:"+$scope.$id+", may implement $scope.SetDefaultValue() function in webapge");
		}
		function StatusChange(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
			console.log("scope.$id:"+$scope.$id+", may implement $scope.StatusChange() function in webapge");
		}
		function ValidateBuffer(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
			console.log("scope.$id:"+$scope.$id+", may implement $scope.ValidateBuffer() function in webapge");
			return true;
		}
        function ValidateTableStructure(){
            var isTbStructureValid = true;

            var tbStructure = $scope.tableStructure;
            var itemsColumn = tbStructure.DataColumns;

            if(typeof(itemsColumn) == "undefined"){
                alert("Table structure is null, avoid to execute.");
                isTbStructureValid = false;
            }
            return isTbStructureValid;
        }
        function IsLimitModelStrictWithSchema(){
            return true;
        }
        function CustomGetDataResult(data_or_JqXHR, textStatus, jqXHR_or_errorThrown){
            var progID = $scope.programId;
            //console.log("scope.$id:"+$scope.$id+", programId:"+progID+", must implement $scope.CustomGetDataResult() function in webapge");
        }
        function SubmitDataResult(data_or_JqXHR, textStatus, jqXHR_or_errorThrown){

        }

        /**
         * Valid the key columns
         * @param {Object} recordObj - provide the record which is going to perform CRUD
         * @return {bool} - true if key columns are exists, not null and empty. false otherwise
         */
        function IsKeyInDataRow(recordObj){
            var tbStructure = $scope.tableStructure;
            var itemsColumn = tbStructure.DataColumns;
            var keyColumn = tbStructure.KeyColumns;

            var isAllKeyExists = true;
            // if PHP check, do not check if do not use PHP, because we don't is the key allow auto gen
            if(!Core.IsMySQLServer())
                return isAllKeyExists;

            for(var keyIndex in keyColumn){
                var keyColName = keyColumn[keyIndex];
                if(typeof(recordObj[keyColName]) == "undefined"){
                    isAllKeyExists = false;
                    continue;
                }
                // find the data type
                var dataTypeFound = false;
                var keyColDataType = "";
                for (var colIndex in itemsColumn) {
                    var colName = colIndex;
                    var colValue = recordObj[colName];
                    if(keyColName == colName){
                        dataTypeFound = true;
                        keyColDataType = itemsColumn[colIndex].type;
                        break;
                    }
                }

                if(keyColDataType == "string"){
                    if(recordObj[keyColName] == null || recordObj[keyColName] == "")
                    {
                        isAllKeyExists = false;
                        continue;
                    }
                }

            }

            return isAllKeyExists;
        }

        /**
         * Convert the entry model strict with schema
         * @param {Object} recordObj - provide the ngModel of entry
         * @return {Object} strictObj - a new record row strict with the table schema
         */
        function ConvertEntryModelStrictWithSchema(recordObj){
            var tbStructure = $scope.tableStructure;
            var itemsColumn = tbStructure.DataColumns;
            var keyColumns = tbStructure.KeyColumns;

            var strictObj = {};
            for (var colIndex in itemsColumn) {
                var colName = colIndex;
                var colDataType = itemsColumn[colIndex].type;
                var colValue = recordObj[colName];

                if(typeof(colValue) == "undefined"){
                    continue;
                }
                // 20170111, keithpoon, also allowed to assign empty, if the user want to update the record from text to empty
//                if(colDataType == "string"){
//                    if(colValue == null || colValue == ""){
//                        continue;
//                    }
//                }
//                if(colDataType == "double"){
//                    var colValueDouble = parseFloat(colValue);
//                    if(colValueDouble == 0){
//                        continue;
//                    }
//                }
                
                // if the column is auto increase set it null
                if(itemsColumn[colIndex].extra == "auto_increment"){
                    continue;
                    strictObj[colIndex] = null;
                }

                strictObj[colIndex] = colValue;
            }
            return strictObj;
        }

        function CreateData(recordObj){
        	var programId = $scope.programId.toLowerCase();

            var isAllKeyExists = IsKeyInDataRow(recordObj);
            if(!isAllKeyExists){
                return $q.reject("Please provide the value of mandatory column. Avoid to create data.");
            }

            var isModelStrictWithSchema = TryToCallIsLimitModelStrictWithSchema();
            if(isModelStrictWithSchema)
                recordObj = ConvertEntryModelStrictWithSchema(recordObj);

			var submitData = {
				"Table": programId,
                "recordObj": recordObj
			};
            var request = DataAdapter.CreateData(submitData);
            return request;
        }

        function UpdateData(recordObj){
        	var clientID = Security.GetSessionID();
        	var programId = $scope.programId.toLowerCase();

            var isAllKeyExists = IsKeyInDataRow(recordObj);
            if(!isAllKeyExists){
                return $q.reject("Please provide the value of mandatory column. Avoid to update data.");
            }

        	var updateObj = {
        		"Header":{},
        		"Items":{}
        	}
        	updateObj.Header[1] = {};
        	//updateObj.Header[1] = recordObj;
            updateObj.Header[1] = ConvertEntryModelStrictWithSchema(recordObj);

        	var isRowEmpty = jQuery.isEmptyObject(updateObj.Header[1])
        	if(isRowEmpty){
                return $q.reject("Cannot update a empty Record");
        	}

			var submitData = {
				"Table": programId,
				"Data": updateObj
			};

            var request = DataAdapter.UpdateData(submitData);
            return request;
        }

        function DeleteData(recordObj){
        	var clientID = Security.GetSessionID();
        	var programId = $scope.programId.toLowerCase();

            var isAllKeyExists = IsKeyInDataRow(recordObj);
            if(!isAllKeyExists){
                return $q.reject("Key not complete in record, avoid to delete data.");
            }

        	var deleteObj = {
        		"Header":{},
        		"Items":{}
        	}
        	deleteObj.Header[1] = {};
        	//deleteObj.Header[1] = recordObj;
//            deleteObj.Header[1] = ConvertKeyFieldToUppercase(recordObj, true);
            deleteObj.Header[1] = ConvertKeyFieldToUppercase(recordObj, true);

        	var isRowEmpty = jQuery.isEmptyObject(deleteObj.Header[1]);

        	if(isRowEmpty){
                return $q.reject("Cannot delete a empty Record");
        	}

			var submitData = {
				"Table": programId,
				"Data": deleteObj
			};

            var request = DataAdapter.DeleteData(submitData);
            return request;
        }

        $scope.Initialize();
    }

    function FindEditModeEnum(attrEditMode){
        var globalCriteria = $rootScope.globalCriteria;
        var isEditModeFound = false;
        var isEditModeNumeric = false;
        var editMode = 0;

        if(typeof(attrEditMode) != undefined){
            if(attrEditMode != null && attrEditMode !=""){
                isEditModeFound = true;
            }
        }
        if(isEditModeFound){
            isEditModeNumeric = !isNaN(parseInt(attrEditMode));
        }
        if(!isEditModeFound){
            editMode = globalCriteria.editMode.None;
        }else{
            if(isEditModeNumeric){
                editMode = attrEditMode;
            }
            else{
                attrEditMode = attrEditMode.toLowerCase();
                if(attrEditMode == "none"){
                    editMode = globalCriteria.editMode.None;
                }
                else if(attrEditMode == "create"){
                    editMode = globalCriteria.editMode.Create;
                }
                else if(attrEditMode == "amend"){
                    editMode = globalCriteria.editMode.Amend;
                }
                else if(attrEditMode == "delete"){
                    editMode = globalCriteria.editMode.Delete;
                }
                else if(attrEditMode == "view"){
                    editMode = globalCriteria.editMode.View;
                }
                else if(attrEditMode == "copy"){
                    editMode = globalCriteria.editMode.Copy;
                }
                else if(attrEditMode == "null"){
                    editMode = globalCriteria.editMode.Null;
                }
                else if(attrEditMode.indexOf("amend") >-1 &&
                        attrEditMode.indexOf("delete") >-1 )
                {
                        editMode = globalCriteria.editMode.AmendAndDelete;
                }
                else{
                    throw ("Unable to identify the edit mode '"+attrEditMode+"' on entry");
                }
            }
        }
        return editMode;
    }
    function templateFunction(tElement, tAttrs) {
        var globalCriteria = $rootScope.globalCriteria;

        var template = '' +
          // outside of the ng-transclude
          // '<div>'+
          // '</div>' +
          // '<div class="well well-sm">'+
          // '<p ng-repeat="dspMsg in DisplayMessageList track by $index" ng-bind="dspMsg"></p>'+
          // '</div>' +
          // inside of the ng-transclude
          //'<div ng-transclude></div>' +
          '<div class="custom-transclude"></div>';
        return template;
    }
    function templateUrlFunction(tElement, tAttrs) {
        var directiveName = tElement[0].tagName;

        directiveName = directiveName.toLowerCase();
        var tempateURL = ThemeService.GetTemplateURL(directiveName);

        return tempateURL;
    }
	return {
		require: ['ngModel'],
		restrict: 'EA', //'EA', //Default in 1.3+
		transclude: true,

		// scope: [false | true | {...}]
		// false = use parent scope
		// true =  A new child scope that prototypically inherits from its parent
		// {} = create a isolate scope
		scope: true,

		controller: EntryConstructor,
		controllerAs: 'entryCtrl',

		//If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
		bindToController: {
			ngModel: '=',
			//editMode: '=?',
			// programId: '=',
/*
			EventListener: '=',
			SubmitData: '=',
			*/
		},
		//templateUrl: templateUrlFunction,
		template: templateFunction,
		compile: function compile(tElement, tAttrs, transclude) {
		    return {
		        pre: function preLink(scope, iElement, iAttrs, controller) {
		            //console.log("entry preLink() compile");
					/*
					var directiveName = iElement[0].tagName;
					directiveName = directiveName.toLowerCase();
					
					var response = ThemeService.GetTemplateHTML(directiveName);

					response.then(function(responseObj) {
						var html = responseObj.data;

						iElement.html(html);
						$compile(iElement.contents())(scope);

						transclude(scope, function(clone, scope) {
							$compile(clone);
							iElement.find('.custom-transclude').append(clone);
						});
					});
					*/
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		            //console.log("entry postLink() compile");


                    transclude(scope, function (clone, scope) {
                        iElement.find('.custom-transclude').append(clone);
                    })
					
                    // lock controls should put post here,
                    var globalCriteria = $rootScope.globalCriteria;
                    if(scope.editMode == globalCriteria.editMode.None ||
                        scope.editMode == globalCriteria.editMode.Null ||
                        scope.editMode == globalCriteria.editMode.Create ||
                        scope.editMode == globalCriteria.editMode.View ||
                        scope.editMode == globalCriteria.editMode.Delete
                    ){
                        // require table structure, lock all control.
                        // the controls will be unlock after table structre received.
//                        console.log("Mode is [View | Delete | None | Null], lock all controls")
                        iElement.ready(function() {
                            if(scope.editMode == globalCriteria.editMode.Delete)
                                scope.LockAllInputBox();
                            else
                                scope.LockAllControls();
                        })
                    }
		        }
		    }
		},
	};
}]);
