"use strict";
var unitEnvApp = angular.module("unitEnvApp",[]);

var app = angular.module("myApp", ["CRUD-create","unitEnvApp"], function($httpProvider, $provide, $injector) {
  // overwirte $log
  /*
  $provide.decorator('$log', function($delegate, $sniffer, $injector) {
    var _log = $delegate.log;
		
    $delegate.log = function(msg){
	  if($injector.get('$rootScope').isDebug)
      _log(msg);
    };
		
    $delegate.info = function(msg){
	  if($injector.get('$rootScope').isDebug)
      _log(msg);
    };
		
    $delegate.warn = function(msg){
	  if($injector.get('$rootScope').isDebug)
      _log(msg);
    };
		
    $delegate.error = function(msg){
	  //if($injector.get('$rootScope').isDebug)
      _log(msg);
    };
		
    $delegate.debug = function(msg){
	  if($injector.get('$rootScope').isDebug)
      _log(msg);
    };
		
		return $delegate;
	});
*/
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
 
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };
 
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});

app.run(function($rootScope, $log) {
	$rootScope.table = {};
	$rootScope.tableSource = {};
	$rootScope.getSchemaStatus = {};
	var host = window.location.hostname;
	var href = window.location.href;
	href = href.toLowerCase();
	if(href.indexOf("demo") >= 0)
		$rootScope.webRoot = "//localhost/DemoBox/";
	else if(href.indexOf("develop") >= 0)
		$rootScope.webRoot = "//localhost/Develop/";
	else if(href.indexOf("flex") >= 0)
		$rootScope.webRoot = "//localhost/flex/";
	else if(href.indexOf("localhost") >= 0)
		$rootScope.webRoot = "//localhost/";
	else
		$rootScope.webRoot = "//kb.acgni.net/";
	$rootScope.controller = $rootScope.webRoot+"controller/";
	$rootScope.webTemplates = $rootScope.webRoot+"Templates/crud/";
	$rootScope.screenFolder = $rootScope.webRoot+"Templates/";
	
	$rootScope.isDebug = true;

	$rootScope.phpConfig = {};
	$rootScope.phpConfig.recordPerPage = 10;

	$rootScope.systemFormat = {};
	$rootScope.systemFormat.mysql_date = "yyyy-MM-dd";
	$rootScope.systemFormat.mysql_datetime = "yyyy-MM-dd HH:mm:ss";

	$rootScope.systemAccessType = {};
	$rootScope.systemAccessType.sys_listen = "Listen";
	$rootScope.systemAccessType.sys_create = "Create";
	$rootScope.systemAccessType.sys_select = "Select";
	$rootScope.systemAccessType.sys_update = "Update";
	$rootScope.systemAccessType.sys_delete = "Delete";

	$rootScope.systemAccessStatus = {};
	$rootScope.systemAccessStatus.sys_initial = "Initial";
	$rootScope.systemAccessStatus.sys_begin = "Begin";
	$rootScope.systemAccessStatus.sys_submitting = "Submitting";
	$rootScope.systemAccessStatus.sys_success = "Success";
	$rootScope.systemAccessStatus.sys_ok = "OK";
	$rootScope.systemAccessStatus.sys_fail = "Fail";
	
	$rootScope.systemAccessStatus.sys_created = "Created";
	$rootScope.systemAccessStatus.sys_selected = "Selected";
	$rootScope.systemAccessStatus.sys_updated = "Updated";
	$rootScope.systemAccessStatus.sys_deleted = "Deleted";

	$rootScope.systemAccessStatus.sys_recordDuplicated = "RecordDuplicated";
	$rootScope.systemAccessStatus.sys_recordNotFound = "RecordNotFound";
	$rootScope.systemAccessStatus.sys_constraintDenyDelete = "ConstraintDenyDelete";
	$rootScope.systemAccessStatus.sys_lastUpdateChanged = "LastUpdateChanged";

	$rootScope.systemAccessStatus.sys_connectionError = "ConnectionError";
	$rootScope.systemAccessStatus.sys_sqlError = "sqlError";
	$rootScope.systemAccessStatus.sys_jsonError = "JSONError";
	$rootScope.systemAccessStatus.sys_timeout = "Timeout";
	$rootScope.systemAccessStatus.sys_formError = "FormInvalid";

	$rootScope.reservedFields = {};
	$rootScope.reservedFields.createUser = "createUser";
	$rootScope.reservedFields.createDate = "createDate";
	$rootScope.reservedFields.lastUpdateUser = "lastUpdateUser";
	$rootScope.reservedFields.lastUpdateDate = "lastUpdateDate";
	$rootScope.reservedFields.systemUpdateDate = "systemUpdateDate";
	$rootScope.reservedFields.systemUpdateUser = "systemUpdateUser";
	$rootScope.reservedFields.systemUpdateProgram = "systemUpdateProgram";
});

/*
app.controller('CRUD-container', function($scope, $rootScope, $http, $element, $attrs, $log, $timeout) {
	$scope.screenMessage = {};
	$scope.error = [];
	$scope.table = {};
	$scope.action = "";
	$scope.form = {};
	$scope.form.name = "";

	$scope.systemAccessStatus = angular.copy($rootScope.systemAccessStatus);
	$scope.reservedFields = angular.copy($rootScope.reservedFields);
	
	$scope.dataSchema = {}; // format = describe table

	// format similar as $scope.dataSchema
	// table structure in array for template use to repeat the form control
	//
	 * format = {
	 *   "fieldName": {
	 *    "type": "int",
	 *    "length": "10",
	 *    "decimalPoint": "2",
	 *    "null": 1,
	 *    "default": null
	 *	}, ...
	 * }
	//
	$scope.fields = {}; 
	
	$scope.create = {};
	$scope.createDate = {};
	$scope.createDefaultValue = {};
	$scope.submitStatus = {};
	
	$scope.updateFrom = {};
	$scope.updateTo = {};
	$scope.updateStatus = {};

	// store the date object of form control
	$scope.tempDate = {};
	$scope.tempDate.dateObject = {};
	$scope.tempDate.showResultString = {};

	// delete is a reserved word in javascript =[
	//$scope.deleteData = {};	
	
	$scope.test = function(){
	}

	$scope.DebugLog = function(message, status){
		if($rootScope.isDebug){
			switch(status){
				case "log":
					$log.log(message);
					break;
				case "warn":
					$log.warn(message);
					break;
				case "debug":
					$log.debug(message);
					break;
				case "info":
					$log.info(message);
					break;
				default:
					$log.log(message);
			}
		}
	}

	$scope.RemoveReservedFields = function(scopeObject){
		$log.log($scope.reservedFields)
		angular.forEach( $scope.reservedFields, function( columnName, indexName  ) {
                var removeIndex = scopeObject.indexOf(columnName);
                scopeObject.splice(removeIndex,1);
            });
		return scopeObject;
	}

	$scope.Submit = function(relatedData){
		$scope.ResetSubmitStatus();
		$scope.SubmitStart();
		var crud_type = $scope.table.type;
		
		$scope.formData = {};
		switch(crud_type){
			case "create":
				$scope.formData = angular.copy($scope.create);
				break;
			case "read":
				break;
			case "update":
				$scope.formData.from = angular.copy($scope.updateFrom);
				$scope.formData.to = angular.copy($scope.updateTo);
				break;
			case "delete":
				$log.log("parnet check deleteConfirmation: "+$scope.submitStatus.deleteConfirmation)
				if(!$scope.submitStatus.deleteConfirmation)
					return;
				$scope.formData = relatedData;
				$log.log(relatedData);
				break;
		}
		
		// find all the date/datetime/timestamp/time create form control, get the date object and set as string for send to server
		var breakThisLoop = [];
		breakThisLoop[0] = false;
		breakThisLoop[1] = false;
		// loop create form controls
		if(crud_type!="delete")
		angular.forEach( $scope.formData, function( formControlValue, formControlName  ) {
		  if(!breakThisLoop[0]){
			var modelTypeOf = typeof(formControlValue);
			// loop the data schema
			angular.forEach( $rootScope.table[$scope.table.name], function( schemaDetails, tableSchemaIndex ) {
			  if(!breakThisLoop[1]){
				if(schemaDetails.Field == formControlName){
				  $scope.DebugLog("is date/time field checking. control: "+formControlName, +", type:"+schemaDetails.Type+", value:"+formControlValue, "warn");
				  if(modelTypeOf=="object"){
				  	if(formControlValue !=null){
							var year = formControlValue.getFullYear();
							var month = formControlValue.getMonth()+1;
							var day = formControlValue.getDate();
							month = month.toString().length > 1 ? month :"0"+month;
							day = day.toString().length > 1 ? day :"0"+day;
							
							var hours = formControlValue.getHours();
							var minutes = formControlValue.getMinutes();
							var seconds = formControlValue.getSeconds();
							
							hours = hours.toString().length > 1 ? hours :"0"+hours;
							minutes = minutes.toString().length > 1 ? minutes :"0"+minutes;
							seconds = seconds.toString().length > 1 ? seconds :"0"+seconds;
						switch(schemaDetails.Type) {
							case "date":
								$scope.createDate[formControlName] = year+"-"+month+"-"+day;
								break;
							case "datetime":
							case "timestamp":
								$scope.createDate[formControlName] = year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
								break;
							case "time":
								break;
						}
					}
				  }else{
				  	$scope.DebugLog("typeof is not a object, not need convert date to string", "info");
				  }
			    }
			  }
		    });
		  }
		});
		// End - find all the date/datetime/timestamp/time object 
		
		var sendData = {};
		// process the form submission
		switch(crud_type){
			case "create":
				//var ajaxResult = $http.post($scope.action, {"table":$scope.table.name, 'crud-type':crud_type, "create":$scope.formData, "createDate":$scope.createDate})
				sendData = {"table":$scope.table.name, 'crud-type':crud_type, "create":$scope.formData, "createDate":$scope.createDate};
				break;
			case "read":
				break;
			case "update":
				//var ajaxResult = $http.post($scope.action, {"table":$scope.table.name, 'crud-type':crud_type, "updateFrom":$scope.formData.from, "updateTo":$scope.formData.to})
				sendData = {"table":$scope.table.name, 'crud-type':crud_type, "updateFrom":$scope.formData.from, "updateTo":$scope.formData.to};
				break;
			case "delete":
				sendData = {"table":$scope.table.name, 'crud-type':crud_type, "delete":$scope.formData};
				break;
		}

		try{
			$scope.submitStatus.submitting = true;
				$scope.submitStatus.status = $scope.systemAccessStatus.sys_submitting;
			var ajaxResult = $http.post($scope.action, sendData);
		}catch(err){
			$scope.UnlockFormContorl();
			//$scope.submitStatus.statusDesc = "ConnectionError";
			$scope.submitStatus.status = $scope.systemAccessStatus.sys_connectionError;
			$scope.submitStatus.phpError = err;
			$scope.UpdateSubmitStatus(false);
		}
		ajaxResult.success(function(data){
			var tempIsSuccess = false;
			try{
				//$scope.submitStatus.statusDesc = "Fail";
				$scope.submitStatus.status = $scope.systemAccessStatus.sys_fail;
				switch(crud_type){
					case "create":
						var affected_rows = parseInt(data.affected_rows);
						if(affected_rows > 0){
							//$scope.submitStatus.statusDesc = "Created";
							$scope.submitStatus.status = $scope.systemAccessStatus.sys_created;
							for(key in $scope.formData){
								$scope.submitStatus.keyValue[0] = $scope.formData[key];
								break;
							}
							tempIsSuccess = true;
						}
						break;
					case "update":
						$log.debug(data)
						var affected_rows = parseInt(data.affected_rows);
						$log.debug("update result, affected_rows: "+affected_rows);
						if(affected_rows>0){
							//$scope.submitStatus.statusDesc = "Updated";
							$scope.submitStatus.status = $scope.systemAccessStatus.sys_updated;
							$("#"+$scope.table.name+"-refresh-data").trigger('click');
							tempIsSuccess = true;
						}else{
							$scope.submitStatus.status = $scope.systemAccessStatus.sys_lastUpdateChanged;
						}
						break;
					case "delete":
						$log.debug(data)
						var affected_rows = parseInt(data.affected_rows);
						$log.debug("delete result, affected_rows: "+affected_rows)
						if(affected_rows>0){
							//$scope.submitStatus.statusDesc = "Deleted";
							$scope.submitStatus.status = $scope.systemAccessStatus.sys_deleted;
							$("#"+$scope.table.name+"-refresh-data").trigger('click');
							tempIsSuccess = true;
						}
						break;
				}
			}catch(err){
				$scope.submitStatus.status = "JSONError";
				$scope.submitStatus.phpError = err;
			}
				$scope.UpdateSubmitStatus(tempIsSuccess);
				// it must use $timeout instead of setTimeOut(function(){...})

				if(tempIsSuccess){
					$timeout(function(){
						$scope.AfterSubmitOK();
						$scope.ResetSubmitStatus();
						$scope.UnlockFormContorl();
					}, 4000);
				}else{
					$timeout(function(){
						$scope.AfterSubmitFail();
						$scope.ResetSubmitStatus();
				$scope.UnlockFormContorl();
					}, 4000);
				}

		});
		ajaxResult.error(function(data){
			$scope.UnlockFormContorl();
			//$scope.submitStatus.statusDesc = "ConnectionError";
			$scope.submitStatus.status = $scope.systemAccessStatus.sys_connectionError;
			$scope.submitStatus.phpError = data;
			$scope.UpdateSubmitStatus(false);
		});


	} // Submit - End
	$scope.UnlockFormContorl = function(){
		$scope.submitStatus.lockControl = false;
	}
	$scope.LockFormContorl = function(){
		$scope.submitStatus.lockControl = true;
	}

	$scope.SubmitStart = function(){
		$scope.submitStatus.lockControl = true;
		$scope.submitStatus.keyValue = {};
		$scope.submitStatus.status = $scope.systemAccessStatus.sys_begin;
	}


		$scope.ResetSubmitStatus = function(){
			$scope.submitStatus.lockControl = false;			
			$scope.submitStatus.status = $scope.systemAccessStatus.sys_begin;

			// submit [success | fail]
			$scope.submitStatus.isSuccess = false;
			$scope.submitStatus.isFail = false;

			$scope.submitStatus.isSubmitSuccess = false;
			$scope.submitStatus.isSuccess = false;

			// submit break down to
			// create / update / delete - [success | fail]
			$scope.submitStatus.isCreateSuccess = false;
			$scope.submitStatus.isCreateFail = false;
			$scope.submitStatus.isSelectSuccess = false;
			$scope.submitStatus.isSelectFail = false;
			$scope.submitStatus.isUpdateSuccess = false;
			$scope.submitStatus.isUpdateFail = false;
			$scope.submitStatus.isDeleteSuccess = false;
			$scope.submitStatus.isDeleteFail = false;

			$scope.submitStatus.isRecordDuplicated = false;		// create
			$scope.submitStatus.isRecordNotFound = false;		// select
			$scope.submitStatus.isLastUpdateChanged = false;		// update
			$scope.submitStatus.isConstraintDenyDelete = false; // delete

			$scope.submitStatus.isResponseSQLError = false;
			$scope.submitStatus.isResponseJsonError = false;
			$scope.submitStatus.isTimeout = false;
			$scope.submitStatus.isConnectionError = false;

			// ajax call error
			$scope.submitStatus.isConnectionError = false;
		}



		$scope.RefreshData = function(){
			for(i=0; i<$("."+$scope.table.name+"-refresh-data").length; i++)
				$($("."+$scope.table.name+"-refresh-data")[i]).trigger('click');
		}

		$scope.AfterSubmitFail = function(){
		}
		$scope.AfterSubmitOK = function(){
			var crud_type = $scope.table.type;
			switch(crud_type){
				case "create":
					if($scope.submitStatus.isCreateSuccess){
						$scope.ClearCreateForm();
						$scope.ResetCreateFormDefaultValue();
					}
					$scope.RefreshData();
					break;
				case "update":
					$("#"+$scope.table.name+"-back-to-table").trigger('click');
					//$("#"+$scope.table.name+"-refresh-data").trigger('click');
					//$scope.updateFrom = angular.copy($scope.updateTo);
					$scope.RefreshData();
					break;
				case "delete":
					//$("#"+$scope.table.name+"-refresh-data").trigger('click');
					$scope.RefreshData();
					break;
			}
		}
		$scope.UpdateSubmitStatus = function(tempIsActionSuccess){
			var currentStatusBool = tempIsActionSuccess;
			var currentStatusString = $scope.submitStatus.status;

			$log.log(currentStatusString);

			var crud_type = $scope.table.type;
			var systemStatus = angular.copy($rootScope.systemAccessStatus);

			if(currentStatusBool){
				$scope.submitStatus.isSuccess = true;
			}else{
				$scope.submitStatus.isFail = true;

					switch(crud_type){
						case "create":
							$scope.submitStatus.isCreateFail = true;
							break;
						case "update":
							$scope.submitStatus.isUpdateFail = true;
							break;
						case "delete":
							$scope.submitStatus.isDeleteFail = true;
							break;
					}
			}

			switch(currentStatusString){
				case systemStatus.sys_created: // created
					$scope.submitStatus.isCreateSuccess = true;
					break;
				case systemStatus.sys_selected: // selected
					$scope.submitStatus.isSelectSuccess = true;
					break;
				case systemStatus.sys_updated: // updated
					$scope.submitStatus.isUpdateSuccess = true;
					break;
				case systemStatus.sys_deleted: // deleted
					$scope.submitStatus.isDeleteSuccess = true;
					break;

				case systemStatus.sys_recordDuplicated:
					$scope.submitStatus.isRecordDuplicated = true;
					break;
				case systemStatus.sys_recordNotFound:
					$scope.submitStatus.isRecordNotFound = true;
					break;
				case systemStatus.sys_constraintDenyDelete:
					$scope.submitStatus.isConstraintDenyDelete = true;
					break;
				case systemStatus.sys_lastUpdateChanged:
					$scope.submitStatus.isLastUpdateChanged = true;
					break;

				case systemStatus.sys_sqlError:
					$scope.submitStatus.isResponseSQLError = true;
					break;
				case systemStatus.sys_jsonError:
					$scope.submitStatus.isResponseJsonError = true;
					break;
				case systemStatus.sys_timeout:
					$scope.submitStatus.isTimeout = true;
					break;
				case systemStatus.connectionError:
					$scope.submitStatus.isConnectionError = true;
					break;
			}
			$scope.submitStatus.isSubmitSuccess = $scope.submitStatus.isSuccess;
		}

	$scope.ClearCreateForm = function(){
		angular.forEach( $scope.create, function(value, index){
			$scope.create[index] = null;
		});
		angular.forEach($scope.tempDate['dateObject'], function(fieldObject, index){
			$scope.tempDate['dateObject'][index] = null;
		})
	}
	$scope.ResetCreateFormDefaultValue = function(){
		$scope.create = angular.copy($scope.createDefaultValue);
	}

	function ConvertSchema2Fields(jsonData){
		$scope.ConvertSchema2Fields(jsonData);
	}

	$scope.ConvertSchema2Fields = function(jsonData){
		var data = jsonData;
		var crudType = $scope.table.type;
				$rootScope.table[$scope.table.name] = data.data;
				$rootScope.tableSource[$scope.table.name] = data;
				$scope.dataSchema = data.data;
				//$log.log(JSON.stringify(data.data))
				if(crudType=="create" || crudType=="update")
				for(i=0; i<data.data.length; i++){
					var field = data.data[i];
					// assign the field name
					$scope.fields[field.Field] = {};
					// assign the field data type
					var columnType = field.Type;
					if(columnType.indexOf("(") == -1){
						$scope.fields[field.Field]["type"] = field.Type;
					}else{
						$scope.fields[field.Field]["type"] = field.Type.substr(0, field.Type.indexOf("("))
					}
					// assign the field length
					var pureType = $scope.fields[field.Field]["type"];
					$scope.fields[field.Field]["length"] = null;

					// only the char and varchar data type must specify a length
					// javascript integer limit +- 9007199254740992
					// http://stackoverflow.com/questions/307179/what-is-javascripts-highest-integer-value-that-a-number-can-go-to-without-losin
					if(columnType.indexOf("(") >-1){
						switch(pureType){
							case "tinyint":
								// A very small integer. The signed range is -128 to 127. The unsigned range is 0 to 255.
								break;
							case "smallint":
								// A small integer. The signed range is -32768 to 32767. The unsigned range is 0 to 65535.
								break;
							case "mediumint":
								// A medium-sized integer. The signed range is -8388608 to 8388607. The unsigned range is 0 to 16777215.
								break;
							case "int":
							case "integer": // This type is a synonym for INT.
								// A normal-size integer. The signed range is -2147483648 to 2147483647. The unsigned range is 0 to 4294967295.
								break;
						}
						switch(pureType){
							case "decimal":
								// assign the 
								$scope.fields[field.Field]["length"] = field.Type.substring(field.Type.indexOf('(')+1, field.Type.indexOf(',') );
								if(columnType.indexOf(",") >-1)
								{
									$scope.fields[field.Field]["decimalPoint"] = field.Type.substring(field.Type.indexOf(',')+1, field.Type.indexOf(')') );	
								}
								break;
							default:
								$scope.fields[field.Field]["length"] = field.Type.substring(field.Type.indexOf('(')+1, field.Type.indexOf(')') );
						}
					}else{
						switch(pureType){
							// numeric data type
							case "int":
								break;
							case "double":
								break;
							case "decimal":
								break;
							case "float":
								break;
							// date and time data type, must assign new Date() object if using HTML5 something like input[date]
							case "date":
							case "datetime":
							case "timestamp":
							case "time":
								//$scope.create[field.Field] = new Date();
								break;
							// string type
							case "char":
								break;
							case "varchar":
								break;
							case "tinytext":
								$scope.fields[field.Field]["length"] = 255;
								break;
							case "text":
							case "blob":
								$scope.fields[field.Field]["length"] = 65536;
								break;
							case "mediumtext":
							//MEDIUMBLOB, MEDIUMTEXT   L + 3 bytes, where L < 2^24   (16 Megabytes)
								$scope.fields[field.Field]["length"] = 65536;
								break;
							case "longtext":
							//LONGBLOB, LONGTEXT       L + 4 bytes, where L < 2^32   (4 Gigabytes)
								$scope.fields[field.Field]["length"] = 65536;
								break;
						}
					}
					
					// assign the key type
					// may be no need
					// assign is nullable
					$scope.fields[field.Field]["null"] = 0;
					if(field.Null == "NO")
						$scope.fields[field.Field]["null"] = 1;
					// assign the default value
					$scope.fields[field.Field]["default"] = field.Default;
				}
	}
	
	$scope.GetTableSchema = function(crudType){
		var isGetting = typeof $rootScope.getSchemaStatus[$scope.table.name];
		if(isGetting != "undefined")
			return;
		$rootScope.getSchemaStatus[$scope.table.name] = "init";
		$http(
			{
				method:"POST",
				url:$rootScope.controller+"simple-selectTableStructure.php",
				params:{table:$scope.table.name},
				responseType:'json'
			}).
			success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				try{
					var tempCheck = data;
					console.log("response.access_status: "+tempCheck.access_status);
					ConvertSchema2Fields(data);
					$rootScope.getSchemaStatus[$scope.table.name] = "ok";
				}catch(err){
					$rootScope.getSchemaStatus[$scope.table.name] = "fail";
					console.log("error caused: "+err);
					console.log("status: "+status);
					console.log("headers: "+headers);
					console.log("config: "); console.dir(config);
					console.log("response data: "+data);
				}
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				//$scope.data = "fail";
				$rootScope.getSchemaStatus[$scope.table.name] = "fail";
			});
	}

	$scope.GetCRUDActionType = function(attrs){
		$scope.table.name = attrs.table;
		if(typeof(attrs.create) != "undefined"){
			$scope.table.type = "create";
		}else if(typeof(attrs.read) != "undefined"){
			$scope.table.type = "read";
		}else if(typeof(attrs.update) != "undefined"){
			$scope.table.type = "update";
		}else if(typeof(attrs.delete) != "undefined"){
			$scope.table.type = "delete";
		}else {
			throw "Have not define CRUD type in <crud> tag, please specify [create | read | update | delete]"
		}
	}

	$scope.ResetSubmitStatus();
	
	$log.info("Controller<div crud-container> - executed.");
});
*/


app.directive('unitEnv', function($rootScope, $log, $http, $timeout, mysqlIOService) {
	function UnitEnvConstructor($scope){
		$scope.name = "unitEnvDirectiveCtrl";
		$scope.count = 250;
		$scope.status = "null";
		$scope.lockControls = false;
			$scope.ProgramInit = function(programId){
				console.log("unitEnv, ProgramInit");
				console.log("ProgramID: "+programId);
				return 
			}
			$scope.ProgramBody = function(){

			}
			$scope.ProgramEnd = function(){

			}
			console.log("Constructor: UnitEnvConstructor()")

		/* Event Refresh / View / Submit */
		$scope.Refresh = function(){
			console.log("unitEnv parent Refresh() start.");
		}
		$scope.View = function(){
			console.log("unitEnv parent View() start.");
		}
		$scope.Submit = function(actionURL, tableObj, status){
			console.log("unitEnv parent Submit() start.");
			console.log("Data Sent to unitEnv Submit()")
			console.dir(tableObj);
			status = "created";
		}
		// alias of Submit
		$scope.Save = function(){
			console.log("unitEnv parent Save() start.");
		}
		$scope.Create = function(){
			console.log("unitEnv parent Create() start.");
		}
		$scope.Amend = function(){
			console.log("unitEnv parent Amend() start.");
		}

		$scope.Close = function(){
			console.log("unitEnv parent Close() start.");
		}
		/* Event End */
		$scope.GetScreenLocation = function(programId){
			var screenLocation = "";
			screenLocation = $rootScope.screenFolder + programId + ".html";
			return screenLocation;
		}


		$scope.UnlockAllContorls = function(domElement){
			$scope.lockControls = false;

			var entryDom = domElement;
			var fieldset = [];
			fieldset = $( entryDom ).find( "fieldset" );
			
			$.each( fieldset, function( key, value ) {
			  $(fieldset[key]).prop( "disabled", false );
			});
		}
		$scope.LockAllContorls = function(domElement){
			$scope.lockControls = true;

			var entryDom = domElement;
			var fieldset = [];
			fieldset = $( entryDom ).find( "fieldset" );

			$.each( fieldset, function( key, value ) {
			  $(fieldset[key]).prop( "disabled", true );
			});
		}
	}
	function templateFunction(tElement, tAttrs){
		return '<div class="unit-env"><div class="" ng-transclude></div></div>';
	}
	function PreRender(scope, iElement, iAttrs, parentCtrl){
		console.log("Ctrl: unitEnv PreRender()")
	}
	function PostRender(scope, iElement, iAttrs, parentCtrl){
			console.log("Ctrl: unitEnv PostRender()")
	}
	return{
	    restrict: 'E',
	    transclude: true,
	    //scope: true,
	    //controller: ctrlFunction,
	    //controller: ['$scope', unitEnvCtrl],
	    controller: UnitEnvConstructor,
	    //controllerAs: '$unitEnvCtrl',
    	//bindToController: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: PreRender,
				post: PostRender,
			}
		},
		template: templateFunction
	}
})

function RunTimeException(message){
	this.message = message;
	this.name = "RunTimeException";
}
function NotImplementedException(message){
	this.message = message;
	this.name = "NotImplementedException";	
}

app.factory('domainInquiryBase', function($rootScope, $http, $log) {
	var domainInquiryBase = {};
	domainInquiryBase.Initialize = function(programId){
		//console.log();
		throw new NotImplementedException("Program:"+programId+" factory need to implement function Initialize()");
	}
	domainInquiryBase.ValidateData = function(programId){
		//console.log();
		throw new NotImplementedException("Program:"+programId+" factory need to implement function ValidateData()");
	}
	domainInquiryBase.RefreshDataResult = function(_prgmID, _data, _status, _headers, _config, _statusText){
		//console.log();
		throw new NotImplementedException("Program:"+programId+" factory need to implement function RefreshDataResult()");
	}

	return domainInquiryBase;
});

app.factory('mysqlIOService', function($rootScope, $http, $log) {

	var mysqlAPI = {};

	mysqlAPI.TableName = "";

	mysqlAPI.Testing = function(){
		console.log("testomg");
	};

	mysqlAPI.getTableSchema = function(headerObjectID) {
		mysqlAPI.TableName = headerObjectID;
		var isGetting = typeof $rootScope.getSchemaStatus[headerObjectID];
		if(isGetting != "undefined")
			return;
		$rootScope.getSchemaStatus[headerObjectID] = "init";
		return $http(
			{
				method:"POST",
				url:$rootScope.controller+"simple-selectTableStructure.php",
				params:{table:headerObjectID},
				responseType:'json'
			}).
			success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				try{
					var tempCheck = data;
					console.log("response.access_status: "+tempCheck.access_status);
					ConvertSchema2Fields(data);
					$rootScope.getSchemaStatus[headerObjectID] = "ok";
				}catch(err){
					$rootScope.getSchemaStatus[headerObjectID] = "fail";
					console.log("getTableSchema exception catched: "+err);
					console.log("status: "+status);
					console.log("headers: "+headers);
					console.log("config: "); console.dir(config);
					console.log("response data: "+data);
				}
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				//$scope.data = "fail";
				$rootScope.getSchemaStatus[headerObjectID] = "fail";
			});
	}

/*
	mysqlAPI.ConvertSchema2Fields = function($scope, jsonData){
		var data = jsonData;

		var tableName = mysqlAPI.TableName;		

				$rootScope.table[tableName] = data.data;
				$rootScope.tableSource[tableName] = data;

				$scope.dataSchema = data.data;

				for(i=0; i<data.data.length; i++){
					var field = data.data[i];
					// assign the field name
					$scope.fields[field.Field] = {};
					// assign the field data type
					var columnType = field.Type;
					if(columnType.indexOf("(") == -1){
						$scope.fields[field.Field]["type"] = field.Type;
					}else{
						$scope.fields[field.Field]["type"] = field.Type.substr(0, field.Type.indexOf("("))
					}
					// assign the field length
					var pureType = $scope.fields[field.Field]["type"];
					$scope.fields[field.Field]["length"] = null;

					// only the char and varchar data type must specify a length
					// javascript integer limit +- 9007199254740992
					// http://stackoverflow.com/questions/307179/what-is-javascripts-highest-integer-value-that-a-number-can-go-to-without-losin
					if(columnType.indexOf("(") >-1){
						switch(pureType){
							case "tinyint":
								// A very small integer. The signed range is -128 to 127. The unsigned range is 0 to 255.
								break;
							case "smallint":
								// A small integer. The signed range is -32768 to 32767. The unsigned range is 0 to 65535.
								break;
							case "mediumint":
								// A medium-sized integer. The signed range is -8388608 to 8388607. The unsigned range is 0 to 16777215.
								break;
							case "int":
							case "integer": // This type is a synonym for INT.
								// A normal-size integer. The signed range is -2147483648 to 2147483647. The unsigned range is 0 to 4294967295.
								break;
						}
						switch(pureType){
							case "decimal":
								// assign the 
								$scope.fields[field.Field]["length"] = field.Type.substring(field.Type.indexOf('(')+1, field.Type.indexOf(',') );
								if(columnType.indexOf(",") >-1)
								{
									$scope.fields[field.Field]["decimalPoint"] = field.Type.substring(field.Type.indexOf(',')+1, field.Type.indexOf(')') );	
								}
								break;
							default:
								$scope.fields[field.Field]["length"] = field.Type.substring(field.Type.indexOf('(')+1, field.Type.indexOf(')') );
						}
					}else{
						switch(pureType){
							// numeric data type
							case "int":
								break;
							case "double":
								break;
							case "decimal":
								break;
							case "float":
								break;
							// date and time data type, must assign new Date() object if using HTML5 something like input[date]
							case "date":
							case "datetime":
							case "timestamp":
							case "time":
								//$scope.create[field.Field] = new Date();
								break;
							// string type
							case "char":
								break;
							case "varchar":
								break;
							case "tinytext":
								$scope.fields[field.Field]["length"] = 255;
								break;
							case "text":
							case "blob":
								$scope.fields[field.Field]["length"] = 65536;
								break;
							case "mediumtext":
							//MEDIUMBLOB, MEDIUMTEXT   L + 3 bytes, where L < 2^24   (16 Megabytes)
								$scope.fields[field.Field]["length"] = 65536;
								break;
							case "longtext":
							//LONGBLOB, LONGTEXT       L + 4 bytes, where L < 2^32   (4 Gigabytes)
								$scope.fields[field.Field]["length"] = 65536;
								break;
						}
					}
					
					// assign the key type
					// may be no need
					// assign is nullable
					$scope.fields[field.Field]["null"] = 0;
					if(field.Null == "NO")
						$scope.fields[field.Field]["null"] = 1;
					// assign the default value
					$scope.fields[field.Field]["default"] = field.Default;
				}
	}
*/
	return mysqlAPI;

});

app.directive('screen', function($rootScope, $log, $http, $timeout) {
	function screenTemplateFunction(tElement, tAttrs){
		return '<div ng-include="GetScreenUrl()"></div>';
	}
	function ScreenConstructor($scope, $rootScope, $http, $element, $attrs, $log, $timeout){
		console.log("Constructor: ScreenConstructor");
		$scope.name = "screenDirectiveCtrl";

		$scope.GetScreenUrl = function(){
			console.log("<screen> call GetScreenUrl()");
			return $scope.screenUrl;
		}
	}
	function PreRender(scope, iElement, iAttrs, parentCtrl){
		console.log("<screen> PreRender()");
	}
	function PostRender(scope, iElement, iAttrs, parentCtrl){
		console.log("<screen> PostRender()");

	}
    return {
		restrict: 'E',
		scope: true,
      	controller: ScreenConstructor,
    	bindToController: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: PreRender,
				post: PostRender,
			}
		},
		template: screenTemplateFunction
	};
})
/*
app.controller('EntryConstructor', function($rootScope, $scope, $filter, $log, $http, $timeout, mysqlIOService, domainInquiryBase) {

		$scope.ProgramInit = function(initProgramID){
			return domainInquiryBase.Initialize(initProgramID);
		}

		$scope.UnLockFormContorls = function(){
			var domElement = $scope.domElement;
			$scope.$parent.UnlockFormContorls(domElement);
		}
		$scope.LockFormContorls = function(){
			var domElement = $scope.domElement;

				console.log("hello");

				console.dir(domElement);

			$scope.$parent.LockFormContorls(domElement);
		}

		$scope.SetFormAsDefault = function(){
			angular.copy($scope.fields, $scope.fieldsDefaultValue);
		}

		$scope.Submit = function(actionURL, formObj){
			actionURL = "controller/"+actionURL+".php";
			console.log("Submit trigger in EntryConstructor");
			console.log("Debug - arguments details:");
			console.dir(arguments);
			console.log($scope.status);
			console.log($scope.formObj);

			$scope.submitStatus.type = "create";
			$scope.submitStatus.status = $rootScope.systemAccessStatus.sys_submitting;

			// angularjs From $error
			// https://docs.angularjs.org/api/ng/type/form.FormController
			if(formObj.$invalid){
				$scope.submitStatus.type = $rootScope.systemAccessType.sys_listen;
				$scope.submitStatus.status = $rootScope.systemAccessStatus.sys_formError;
				return;
			}

			// return;

			var sendData = {};
			var formData = {};
			//fromData = angular.copy($scope.fields);

			for (var key in $scope.fields) {
				if($scope.fields.hasOwnProperty(key)){
					var valueOrObject = $scope.fields[key];
					var finalValue = valueOrObject.toString();
					// if Date
					if(valueOrObject instanceof Date){
						// Object.prototype.toString.call(obj) === "[object Date]" will work in every case, and obj instanceof Date will only work in date objects from the same view instance (window).
						// ??
						//finalValue = valueOrObject.toMYSQLDate();

						//finalValue = $filter('date')(valueOrObject, format, timezone);
						finalValue = $filter('date')(valueOrObject, $rootScope.systemFormat.mysql_datetime);
						formData[key] = finalValue;
					}
					else if(valueOrObject.constructor === Array){
						formData[key] = [];
						formData[key] = valueOrObject;
					}else if(valueOrObject.constructor === Object){
						formData[key] = finalValue;
					}else{
						formData[key] = finalValue;
					}
				}
			};

			sendData = {"requestFrom":document.URL, 'jsWinLocate':window.location, "create":formData, "createDate":$scope.createDate};
			var ajaxResult = $http.post(actionURL, sendData);

			ajaxResult.success(function(data){
				var tempIsSuccess = false;
				try{
					// $scope.submitStatus.status = $scope.systemAccessStatus.sys_fail;
							var affected_rows = parseInt(data.affected_rows);
							if(affected_rows > 0){
								$scope.submitStatus.status = $rootScope.systemAccessStatus.sys_ok;
								$scope.submitStatus.message = data;

								$scope.status = $rootScope.systemAccessStatus.sys_ok;
							}
				}catch(err){
					//$scope.submitStatus.status = "JSONError";
					//$scope.submitStatus.phpError = err;
					$scope.phpError.catchError = err;
					console.log("Ajax was responsed, but error caused.");
					console.log("Error:"+err);

					$scope.submitStatus.status = $rootScope.systemAccessStatus.sys_fail;
					$scope.submitStatus.message = err;
				}

			});
			ajaxResult.error(function(data){
				$scope.status = $rootScope.systemAccessStatus.sys_connectionError;
				$scope.phpError.responseData = data;
			});
		}

		console.log("Constructor: EntryConstructor()");

		$scope.domElement = getElementByScope($scope.$id);
		$scope.enableForm = true;
		$scope.submitStatus = {};
		$scope.submitStatus.type = $rootScope.systemAccessType.sys_listen;
		$scope.submitStatus.status = $rootScope.systemAccessStatus.sys_initial;
		$scope.submitStatus.message = "";
		$scope.name = "entryDirectiveCtrl";
		//$scope.title = "";
		//$scope.programId = "";
		//$scope.screen = "";
		$scope.defaultMode = "";
		$scope.count = 0;

		$scope.screenUrl = "";
		$scope.fields = {};
		$scope.fieldsDefaultValue = {};
		var tempFields = $scope.ProgramInit($scope.programId);
		if(tempFields === null || typeof(tempFields) =="undefined"){
			console.log("Return a object about fields in domainInquiryBase.Initialize")
		}else{
			$scope.fields = tempFields;
			angular.copy($scope.fieldsDefaultValue, $scope.fields);
			console.log("fields defined by Override function")
			console.dir($scope.fieldsDefaultValue)
		}

		$scope.$watch(
			function($scope){
				return $scope.submitStatus.status;
			},
			function(newValue, oldValue) {
				console.log("submitStatus was changing from "+oldValue + " to "+newValue+".");
				var entryDom = $scope.domElement;

				if(oldValue == $rootScope.systemAccessStatus.sys_submitting){
					if(newValue == $rootScope.systemAccessStatus.sys_created){
						$scope.SetFormAsDefault();
					}
					$scope.enableForm = true;
					//$scope.UnlockFormContorls(entryDom);
					$scope.UnlockFormContorls();
				}

				if(newValue == $rootScope.systemAccessStatus.sys_listen){
					// reset form as default value
					$scope.SetFormAsDefault();
				}

				if(newValue == $rootScope.systemAccessStatus.sys_submitting){
					// reset form as default value
					$scope.enableForm = false;
					//$scope.LockFormContorls(entryDom);
					$scope.LockFormContorls();
				}
			}
		);
});
*/
app.directive('entry', function($rootScope, $filter, $log, $http, $timeout, mysqlIOService, domainInquiryBase) {
	function templateFunction(tElement, tAttrs){
		return '<div class="entry"><div class="" ng-transclude></div></div>';
	}
	function PreRender($scope, iElement, iAttrs, parentCtrl){
		console.log("<entry> PreRender()");

		$scope.title = iAttrs.title;
		$scope.programId = iAttrs.programId;
		$scope.screen = iAttrs.programId;

		$scope.screenUrl = $scope.GetScreenLocation($scope.screen);

		$scope.phpError = {};

		$scope.SetFormAsDefault();
	}
	function PostRender(scope, iElement, iAttrs, parentCtrl){
		console.log("<entry> PostRender()");
	}
	function EntryConstructor($scope){
		$scope.ProgramInit = function(initProgramID){
			var tempFields = {};

			tempFields = domainInquiryBase.Initialize(initProgramID);

			if(tempFields === null || typeof(tempFields) =="undefined"){
				console.log("Return a object about fields in domainInquiryBase.Initialize")
			}else{
				$scope.fields = tempFields;
				angular.copy($scope.fields, $scope.fieldsDefaultValue);
				console.log("fields defined by Override function")
			}

			return tempFields;
		}
		$scope.ValidateData = function(programID, fields){
			return domainInquiryBase.ValidateData(programID, fields);
		}

		$scope.UnlockFormContorls = function(){
			var domElement = $scope.domElement;
			$scope.$parent.UnlockAllContorls(domElement);
		}
		$scope.LockFormContorls = function(){
			var domElement = $scope.domElement;
			$scope.$parent.LockAllContorls(domElement);
		}

		$scope.SetFormAsDefault = function(){
			//angular.copy($scope.fields, $scope.fieldsDefaultValue);
			angular.copy($scope.fieldsDefaultValue, $scope.fields);
		}

		$scope.Submit = function(actionURL, formObj){
			actionURL = "controller/"+actionURL+".php";
			console.log("Submit trigger in EntryConstructor");
			console.log("Debug - arguments details:");
			console.dir(arguments);
			console.log($scope.status);
			console.log($scope.formObj);

			$scope.submitStatus.type = "create";
			$scope.submitStatus.status = $rootScope.systemAccessStatus.sys_submitting;

			// angularjs From $error
			// https://docs.angularjs.org/api/ng/type/form.FormController
			if(formObj.$invalid){
				$scope.submitStatus.type = $rootScope.systemAccessType.sys_listen;
				$scope.submitStatus.status = $rootScope.systemAccessStatus.sys_formError;
				return;
			}

			// return;

			var sendData = {};
			var formData = {};
			//fromData = angular.copy($scope.fields);

			for (var key in $scope.fields) {
				if($scope.fields.hasOwnProperty(key)){
					var valueOrObject = $scope.fields[key];
					console.log("valueOrObject: "+valueOrObject);
					console.log("key: "+key);

					if(valueOrObject != null){

						var finalValue = valueOrObject.toString();
						// if Date
						if(valueOrObject instanceof Date){
							// Object.prototype.toString.call(obj) === "[object Date]" will work in every case, and obj instanceof Date will only work in date objects from the same view instance (window).
							// ??
							//finalValue = valueOrObject.toMYSQLDate();

							//finalValue = $filter('date')(valueOrObject, format, timezone);
							finalValue = $filter('date')(valueOrObject, $rootScope.systemFormat.mysql_datetime);
							formData[key] = finalValue;
						}
						else if(valueOrObject.constructor === Array){
							formData[key] = [];
							formData[key] = valueOrObject;
						}else if(valueOrObject.constructor === Object){
							formData[key] = finalValue;
						}else{
							formData[key] = finalValue;
						}
					}
				}
			};

			sendData = {"requestFrom":document.URL, 'jsWinLocate':window.location, "create":formData, "createDate":$scope.createDate};
			var ajaxResult = $http.post(actionURL, sendData);

			ajaxResult.success(function(data){
				var tempIsSuccess = false;
				try{
					// $scope.submitStatus.status = $scope.systemAccessStatus.sys_fail;
							var affected_rows = parseInt(data.affected_rows);
							if(affected_rows > 0){
								$scope.submitStatus.status = $rootScope.systemAccessStatus.sys_ok;
								$scope.submitStatus.message = data;

								$scope.status = $rootScope.systemAccessStatus.sys_ok;
							}
				}catch(err){
					//$scope.submitStatus.status = "JSONError";
					//$scope.submitStatus.phpError = err;
					$scope.phpError.catchError = err;
					console.log("Ajax was responsed, but error caused.");
					console.log("Error:"+err);

					$scope.submitStatus.status = $rootScope.systemAccessStatus.sys_fail;
					$scope.submitStatus.message = err;
				}
					// it must use $timeout instead of setTimeOut(function(){...})

					/*
					if(tempIsSuccess){
						$timeout(function(){
							$scope.AfterSubmitOK();
							$scope.ResetSubmitStatus();
							$scope.UnlockFormContorl();
						}, 4000);
					}else{
						$timeout(function(){
							$scope.AfterSubmitFail();
							$scope.ResetSubmitStatus();
					$scope.UnlockFormContorl();
						}, 4000);
					}
					*/

			});
			ajaxResult.error(function(data){
				$scope.status = $rootScope.systemAccessStatus.sys_connectionError;
				$scope.phpError.responseData = data;
			});
		}

		console.log("Constructor: EntryConstructor()");

		$scope.domElement = {};
		$scope.domElement = getElementByScope($scope);
		// getElementByScope(scope, function(domElement){
		// 	$scope.domElement = domElement;
		// });


		$scope.enableForm = true;
		$scope.submitStatus = {};
		$scope.submitStatus.type = $rootScope.systemAccessType.sys_listen;
		$scope.submitStatus.status = $rootScope.systemAccessStatus.sys_initial;
		$scope.submitStatus.message = "";
		$scope.name = "entryDirectiveCtrl";
		//$scope.title = "";
		//$scope.programId = "";
		//$scope.screen = "";
		$scope.defaultMode = "";
		$scope.count = 0;

		$scope.screenUrl = "";
		$scope.fields = {};
		$scope.fieldsDefaultValue = {};
		var tempFields = $scope.ProgramInit($scope.programId);
		// if(tempFields === null || typeof(tempFields) =="undefined"){
		// 	console.log("Return a object about fields in domainInquiryBase.Initialize")
		// }else{
		// 	$scope.fields = tempFields;
		// 	angular.copy($scope.fields, $scope.fieldsDefaultValue);
		// 	console.log("fields defined by Override function")
		// }

		/*
		$scope.$watch('status', function(newValue, oldValue) {
		  switch(newValue){
		  	case "submitting":
		  	case "refreshing":
		  		$scope.enableForm = false;
		  		//$scope.LockFormContorls();
		  		break;
		  	case "created":
		  	case "selected":
		  	case "updated":
		  	case "deleted":
		  		$scope.enableForm = true;
		  		//$scope.UnLockFormContorls();
		  		break;
		  	default:
		  		$scope.enableForm = true;
		  		//$scope.UnLockFormContorls();
		  		break;
		  }
		});
		*/

		$scope.$watch(
			function($scope){
				return $scope.submitStatus.status;
			},
			function(newValue, oldValue) {
				console.log("submitStatus was changing from "+oldValue + " to "+newValue+".");
				var entryDom = $scope.domElement;

				if(oldValue == $rootScope.systemAccessStatus.sys_submitting){
					if(newValue == $rootScope.systemAccessStatus.sys_ok){
						$scope.SetFormAsDefault();
					}
					$scope.enableForm = true;
					//$scope.UnlockFormContorls(entryDom);
					$scope.UnlockFormContorls();
				}

				if(newValue == $rootScope.systemAccessStatus.sys_listen){
					// reset form as default value
					$scope.SetFormAsDefault();
				}

				if(newValue == $rootScope.systemAccessStatus.sys_submitting){
					// reset form as default value
					$scope.enableForm = false;
					//$scope.LockFormContorls(entryDom);
					$scope.LockFormContorls();
				}
			}
		);

/*
		$scope.$watch(
			function($scope){
				return $scope.enableForm;
			},
			function(newValue, oldValue) {
				var entryDom = $scope.domElement;
				var fieldset = [];
				fieldset = $( entryDom ).find( "fieldset" );
				if(newValue === true){
					$.each( fieldset, function( key, value ) {
					  $(fieldset[key]).prop( "disabled", false );
					});
				}else{

					$.each( fieldset, function( key, value ) {
					  $(fieldset[key]).prop( "disabled", true );
					});
				}
			},
			true
		)
		*/
	}
	return {
		require: '^unitEnv', 
		// The ^ prefix means that this directive searches for the controller on its parents 
		// (without the ^ prefix, the directive would look for the controller on just its own element).
		restrict: 'E',
		transclude: true, // true: Creating a Directive that Wraps Other Elements
		/*
		// if you use this, this directive will have two scope
		// scope: true,
		// or this
		scope: {
			// '@', one way with evaluate the value
			// '=',  two way data binding
			// customerInfo: '=info'
			// directive.customerInfo = controller.info
			// '&', allows a directive to trigger evaluation of an expression in the context of the original scope
			title: '@',
			programId: '@',
			screen:'@',
			defaultMode: '@',
			count:'=',
			GetScreenLocation: '=',
		},
		*/
		// scope: {
		// 	GetScreenLocation: '&'
		// },
		scope: false,
	    controller: EntryConstructor,
	    //controllerAs: '$entryCtrl',
    	bindToController: true,
    	// bindToController: {
    	// 	Submit
    	// },
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: PreRender,
				post: PostRender,
			}
		},
		template: templateFunction
	};

})

app.directive('pageview', function($rootScope, $filter, $log, $http, $timeout, mysqlIOService, domainInquiryBase) {
	function templateFunction(tElement, tAttrs){
		return '<div class="pageview"><div class="" ng-transclude></div></div>';
	}
	function PreRender($scope, iElement, iAttrs, parentCtrl){
		console.log("<pageview> PreRender()");

		$scope.title = iAttrs.title;
		$scope.programId = iAttrs.programId;
		$scope.screen = iAttrs.programId;

		$scope.screenUrl = $scope.GetScreenLocation($scope.screen);

		$scope.enableForm = true;

		$scope.phpError = {};

		$scope.RefreshPageCount();
		//$scope.RefreshPageData();
		// $scope.PointToPage(1);

	}
	function PostRender($scope, iElement, iAttrs, parentCtrl){
		console.log("<pageview> PostRender()");

		$scope.$watch(
			function($scope){
				// console.dir($scope)
				return $scope.step;
			},
			function(newValue, oldValue) {
			console.log("step was changing from "+oldValue + " to "+newValue+".");
			$scope.ReCalculateMaxPageNum();
			if($scope.currentPageNum > $scope.maxPageNum)
				$scope.PointToLastPage();
			else
				$scope.PointToPage($scope.currentPageNum);
		});
	}
	function PageViewConstructor($scope){
		$scope.ProgramInit = function(initProgramID){
			return domainInquiryBase.Initialize(initProgramID);
		}
		$scope.Submit = function(actionURL, formObj){
			console.log("Submit trigger in PageViewConstructor");
			console.log("Selected record: ...");
			console.dir($scope.formObj);
			$scope.selectedRecord = formObj;
		}
		$scope.RefreshPageCount = function(){
			$scope.RefreshData("count", -1, function(_prgmID, _data, _status, _headers, _config, _statusText){
				//return domainInquiryBase.RefreshDataResult(_prgmID, _data, _status, _headers, _config, _statusText);
				var _recordsCount = _data[0].count;

				console.log("The total count found.");

				$scope.CalculateMaxPageNum(_recordsCount);
				$scope.PointToPage(1);
			});
		}
		$scope.RefreshPageData = function(refreshPageNum, callBackFtn){
			var recordPerPage = $rootScope.phpConfig.recordPerPage;

			var sourceStart = recordPerPage*(refreshPageNum-1);
			var sourceEnd = recordPerPage*refreshPageNum-1;

			var assignRow = sourceStart;

			//$scope.RefreshData("select", refreshPageNum);
			console.log("Get date of page."+refreshPageNum);
			$scope.RefreshData("select", refreshPageNum, function(_prgmID, _data, _status, _headers, _config, _statusText){
				//console.log("call back start");
				console.log("Date responsed of page."+refreshPageNum);

				for(var dataIndex in _data){
					var dataRow = _data[dataIndex];

					$scope.dataSource[assignRow] = dataRow;

					assignRow++;
				}

				callBackFtn(_prgmID, _data, _status, _headers, _config, _statusText);

			});
		}
		// get Database records
		$scope.RefreshData = function(requestType, switchToPage, callBackFtn){
			// $scope.DisableRefreshButton();
			var prgmID = $scope.programId;

			var actionURL = "controller/"+prgmID+".php";

			if(typeof(switchToPage) === "undefined")
				switchToPage = 1;

			if(typeof(requestType) === "undefined")
				requestType = "select";

			var sendData = {};
			var formData = {};
			formData.pageNum = switchToPage;
			formData.recordPerPage = $scope.recordPerPage;
			
			sendData = {"requestFrom":document.URL, 'jsWinLocate':window.location, "requestType":requestType, "select":formData};
			var ajaxResult = $http.post(actionURL, sendData);

			ajaxResult.success(function(data){
				var tempIsSuccess = false;
				try{
					var _data = data.data;
					var _status = data.status;
					var _headers = data.headers;
					var _config = data.config;
					var _statusText = data.statusText;
					// $scope.submitStatus.status = $scope.systemAccessStatus.sys_fail;
					var affected_rows = parseInt(data.affected_rows);
					if(affected_rows > 0){
						$scope.status = $rootScope.systemAccessStatus.sys_ok;
						//$scope.displayData = _data;
						//console.dir($scope.displayData)
					}
					//return callBackFtn(prgmID, _data, _status, _headers, _config, _statusText );
					callBackFtn(prgmID, _data, _status, _headers, _config, _statusText );
				}catch(err){
					$scope.phpError.catchError = err;
					console.log("Ajax was responsed, but error caused.")
					console.log("Error:"+err);
					console.dir(err)
				}

			});
			ajaxResult.error(function(data){
				$scope.status = $rootScope.systemAccessStatus.sys_connectionError;
				$scope.phpError.responseData = data;
				//return callBackFtn(prgmID, _data, _status, _headers, _config, _statusText );
				callBackFtn(prgmID, _data, _status, _headers, _config, _statusText );
			});
		}

		// pageNum: one based
		$scope.PointToPage = function(pageNum){
			// $scope.FindMaxPageNum();
			var isPointAtStart = false;
			var isPointAtEnd = false;
			var maxPageNum = $scope.maxPageNum;

			$scope.displayData = [];
				
			if(maxPageNum<=0){
				$scope.isPointAtStart = isPointAtStart;
				$scope.isPointAtEnd = isPointAtEnd;
				return;
			}
			// var totalDataRows = $scope.dataSource.length;
			var totalDataRows = $scope.totalRecordsCount;

			var step = $scope.step;
			var rowStart = step*(pageNum-1);
			var rowEnd = step*pageNum;

			// is $scope.dataSource exists
			var isExpectRecordExist = true;
			for(var i=rowStart; i<rowEnd; i++){
				if(i>=totalDataRows){
					break;
				}
				else{
					if($scope.dataSource[i] == null){
						isExpectRecordExist = false;
						break;
					}
				}
			}

			// call ajax to getRecord
			var divisor = $rootScope.phpConfig.recordPerPage;
			var quotientStart = Math.floor(rowStart / divisor); // round in downward
			var remainderStart = rowStart % divisor;

			var quotientEnd = Math.ceil(rowEnd / divisor); // round in upward
			var remainderEnd = rowEnd % divisor;

			for(var _refreshPageNum=quotientStart; _refreshPageNum<quotientEnd; _refreshPageNum++){
				var refreshPageNum = _refreshPageNum+1;

				// skip to RefreshPageData again if records were getting
				if(!isExpectRecordExist)
				{
					$scope.RefreshPageData(refreshPageNum, function(_prgmID, _data, _status, _headers, _config, _statusText){
						// assign data from $scope.dataSource to $scope.displayData
						for(var i=rowStart; i<rowEnd; i++){
							if(i>=totalDataRows)
								break;
							$scope.displayData[$scope.displayData.length] = $scope.dataSource[i];
						}
					});
				}else{
					for(var i=rowStart; i<rowEnd; i++){
						if(i>=totalDataRows)
							break;

						$scope.displayData[$scope.displayData.length] = $scope.dataSource[i];
					}
				}
			}

			$scope.currentPageNum = pageNum;

			if($scope.currentPageNum==1)
				isPointAtStart = true;

			if($scope.currentPageNum == $scope.maxPageNum)
				isPointAtEnd = true;

			$scope.isPointAtStart = isPointAtStart;
			$scope.isPointAtEnd = isPointAtEnd;
		}

		$scope.PointToNextPage = function(){
			var curPageNum = $scope.currentPageNum;
			// var totalDataRows = $scope.dataSource.length;
			var maxPageNum = $scope.maxPageNum;

			if(curPageNum<maxPageNum)
				$scope.PointToPage(curPageNum + 1);
		}
		$scope.PointToPreviousPage = function(){
			var curPageNum = $scope.currentPageNum;
			if(curPageNum>1)
				$scope.PointToPage(curPageNum - 1);
		}

		$scope.PointToFirstPage = function(){
			$scope.PointToPage(1);
		}

		$scope.PointToLastPage = function(){
			$scope.PointToPage($scope.maxPageNum);
		}
		/*
		$scope.FindMaxPageNum = function(){
			var totalDataRows = $scope.dataSource.length;
			var step = $scope.step;

			var maxPageNum = 0;
			if(totalDataRows!=0)
				if(totalDataRows%step==0)
					maxPageNum = totalDataRows/step;
				else
					maxPageNum = Math.floor(totalDataRows/step)+1;

			$scope.maxPageNum = maxPageNum;
		}
		*/
		$scope.CalculateMaxPageNum = function(totalRecordsCount){
			console.log("Program: "+$scope.programId+", total records count:"+totalRecordsCount);
			$scope.totalRecordsCount = totalRecordsCount;
			var totalDataRows = totalRecordsCount;
			var step = $scope.step;
			$scope.displayPageNum = [];

			var maxPageNum = 0;
			if(totalDataRows!=0)
				if(totalDataRows%step==0)
					maxPageNum = totalDataRows/step;
				else
					maxPageNum = Math.floor(totalDataRows/step)+1;

			for(var i=0; i<maxPageNum; i++){
				$scope.cacheData[i] = null;
				$scope.displayPageNum[i] = {};
				$scope.displayPageNum[i].pageNum = i+1;
				$scope.displayPageNum[i].notAnOption = false;

			}

			$scope.maxPageNum = maxPageNum;
		}
		$scope.ReCalculateMaxPageNum = function(){
			$scope.CalculateMaxPageNum($scope.totalRecordsCount);
		}

		
		$scope.PointToRecord = function($event, pointedRecord){
			var $element = $($event.currentTarget);
			var $parent = $element.parent();

			$parent.children("tr").removeClass("info");

			$element.addClass("info")

			$scope.pointedRecord = pointedRecord;
		}
		
		$scope.DoubleClickAndPointToRecord = function($event, pointedRecord){

			$scope.PointToRecord($event, pointedRecord);

			$scope.PointToRecordConfirm();
		}

		$scope.PointToRecordConfirm = function(){
			$scope.selectedRecord = $scope.pointedRecord;
		}
		
		/*
		$rootScope.$watch(
			function(){return $rootScope.getSchemaStatus[$scope.table.name]},
			function(newValue, oldValue){
				if ( newValue !== oldValue )
				if($rootScope.getSchemaStatus[$scope.table.name]=="ok"){
					$scope.RefreshData();
				}else{
					console.warn("ListWin Controller: ");
					console.warn("Obtain table structure 'fail', cancel to read data from table "+$scope.table.name);
				}
			}
		);
		*/

		console.log("Constructor: PageViewConstructor()");

		$scope.name = "pageviewDirectiveCtrl";
		//$scope.title = "";
		//$scope.programId = "";
		//$scope.screen = "";
		$scope.defaultMode = "";
		$scope.count = 0;

		$scope.screenUrl = "";
		$scope.fields = {};
		$scope.displayData = []; // [0] = first record of the current page, [1] = second record of the current page
		$scope.cacheData = []; // [0] = first record, [1] = second record
		$scope.dataSource = [];

		$scope.pointedRecord = {}; // the record which was pointed in the current page.
		$scope.selectedRecord = {}; // the record which was selected in the current page, may be selected to be amend
		$scope.totalRecordsCount = 0;

		$scope.step = 10;
		$scope.pageSize = 5; // now unused, max to show how many page button
		$scope.currentPageNum = -1;
		$scope.maxPageNum = -1;
		$scope.recordPerPage = $rootScope.phpConfig.recordPerPage;
		$scope.step = $scope.recordPerPage;
		$scope.displayPageNum = [];

		$scope.isPointAtStart = false; // just a record level flag, no condition in used.
		$scope.isPointAtEnd = false; // just a record level flag, no condition in used.

		// table sortable function
		$scope.sort = {}
		$scope.sort.predicate = '';
		$scope.sort.reverse = false;

		var tempFields = $scope.ProgramInit($scope.programId);
		if(tempFields === null || typeof(tempFields) =="undefined"){
			console.log("Return a object about fields in domainInquiryBase.Initialize")
		}else{
			$scope.fields = tempFields;
		}
	}
	return {
		require: '^unitEnv', 
		// The ^ prefix means that this directive searches for the controller on its parents 
		// (without the ^ prefix, the directive would look for the controller on just its own element).
		restrict: 'E',
		transclude: true, // true: Creating a Directive that Wraps Other Elements
		/*
		// if you use this, this directive will have two scope
		// scope: true,
		// or this
		scope: {
			// '@', one way with evaluate the value
			// '=',  two way data binding
			// customerInfo: '=info'
			// directive.customerInfo = controller.info
			// '&', allows a directive to trigger evaluation of an expression in the context of the original scope
			title: '@',
			programId: '@',
			screen:'@',
			defaultMode: '@',
			count:'=',
			GetScreenLocation: '=',
		},
		*/
		//scope: false,
		/*
		scope: {
			recordPerPage: '=',
			step:'='
		},
		*/
	    controller: PageViewConstructor,
	    //controllerAs: '$pageViewCtrl',
    	bindToController: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: PreRender,
				post: PostRender,
			}
		},
		template: templateFunction
	};

});

app.directive('editbutton', function($){

});

// define the <crud> tag
app.directive('crud', function($rootScope, $log) {
    return {
      restrict: 'E',
      scope: true, // set true for shared parent scope, set scope:{}, isolate scope
      controller: "@",
	  name: "controller",
	  templateUrl: function(elem, attrs){
	  	var tempCrudActionType = attrs.type;
	  	var tempCrudTableName = attrs.table

	  	var crudActionType = tempCrudActionType;

		if(typeof(attrs.create) != "undefined"){
			crudActionType = "create";
		}else if(typeof(attrs.read) != "undefined"){
			crudActionType = "read";
		}else if(typeof(attrs.update) != "undefined"){
			crudActionType = "update";
		}else if(typeof(attrs.delete) != "undefined"){
			crudActionType = "delete";
		}

		var defaultPath = $rootScope.webTemplates;
		var customPath = $rootScope.webTemplates+"crud/crud-"+crudActionType+"-"+tempCrudTableName+".html";
		var targetPath = "";
		var folderName = "";
		var templateName = "crud-"+crudActionType+".html";
		//
		//	defaultPath = [default/custom]
		//		default = root/Templates/crud/crud-type.html
		//		custom 	= root/Templates/crud/custom/crud-type-table.html
		//
		if(!attrs.customTemplate){
			switch(attrs.templateType){
				case "default": // default template
					break;
				case "html5": // view in batch
					folderName = "html5/";
					templateName = "crud-HTML5-"+crudActionType+".html";
					break;
				case "individual": // create / read / update / delete in individual record
					folderName = "individual/";
					break;
				case "auto": // create / read / update / delete mode are auto detect
					folderName = "auto_mode/";
					break;
				case "custom":
					folderName = "custom/";
					templateName = "crud-"+crudActionType+"-"+tempCrudTableName+".html";
					break;
				default:
					targetPath = defaultPath;
					break;
			}
			targetPath = defaultPath + folderName + templateName;
			if(typeof(attrs.templatePath) != "undefined"){
				if(attrs.templatePath != null && attrs.templatePath != "")
					targetPath = attrs.templatePath;
			}
		}else{
			folderName = "tailor-make/";
			targetPath = defaultPath + folderName + attrs.customTemplate;
		}

		$log.info("Directive<crud> | templateUrl() - template URL generated: " + targetPath);
		  return targetPath;
	  },
	  link: function(scope, elem, attrs){
		//console.log("Directive<crud>| link");
		$log.info("Directive<crud> | link()");
	  }
	};
});
 
/* EditBox */
// text, integer, decimal date, time, datetime

/* Range */

  
// define the integer attribute for input control
/*
var INTEGER_REGEXP = /^\-?\d+$/;
app.directive('integer', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.integer = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});
*/
app.directive('integer', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

app.filter('number', [function() {
        return function(input) {
            return parseInt(input, 10);
        };
    }]);

/*
app.directive('numeric', function () {
	return {
		require: 'ngModel',
		link: function (scope) {	
			scope.$watch('wks.number', function(newValue,oldValue) {
                var arr = String(newValue).split("");
                if (arr.length === 0) return;
                if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.' )) return;
                if (arr.length === 2 && newValue === '-.') return;
                if (isNaN(newValue)) {
                    scope.wks.number = oldValue;
                }
            });
		}
	};
});
*/

// uppercase directive
app.directive('uppercase', function($filter) {
   return {
     restrict: 'A',
     require: 'ngModel',
     link: function(scope, element, attrs, ngCtrl) {
     	/*

		//format text going to user (model to view)
		ngCtrl.$formatters.push(function(value) {
		return value.toUpperCase();
		});

		//format text from the user (view to model)
		ngCtrl.$parsers.push(function(value) {
			return value.toUpperCase();
		});
		*/
		//format text from the user (view to model)
		ngCtrl.$parsers.push(function(value) {
			return value.toUpperCase();
		});
		/*
		element.on('input', function () {
                    var currentViewValue = ngCtrl.$viewValue;
                    var modifiedViewValue = $filter('uppercase')(currentViewValue);

                    ngCtrl.$setViewValue(modifiedViewValue);
                    ngCtrl.$render();
        });
        */
     }
   };
});

app.directive('convertSelectValueToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return parseInt(val, 10);
      });
      ngModel.$formatters.push(function(val) {
        return '' + val;
      });
    }
  };
});

/*
var INTEGER_REGEXP = /^\d{4}$/;
app.directive('year', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.integer = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});

var INTEGER_REGEXP = /^(0?[1-9]|1[012])$/;
app.directive('month', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.integer = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});
*/

/*
app.directive('myTabs', function() {
	function ctrlFunction($scope){

      var panes = $scope.panes = [];

      $scope.select = function(pane) {
        angular.forEach(panes, function(pane) {
          pane.selected = false;
        });
        pane.selected = true;
      };

      this.addPane = function(pane) {
        if (panes.length === 0) {
          $scope.select(pane);
        }
        panes.push(pane);
      };
	}
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
	    controller: ['$scope', ctrlFunction],
    templateUrl: 'my-tabs.html'
  };
})

app.directive('myPane', function() {
	function templateFunction(tElement, tAttrs){
		return '<div class="tab-pane" ng-show="selected" ng-transclude></div>';
	}
  return {
    require: '^myTabs',
    restrict: 'E',
    transclude: true,
    scope: {
      title: '@'
    },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addPane(scope);
    },
    //templateUrl: 'my-pane.html'
    template: templateFunction
  };
});
*/

 Date.prototype.toMYSQLDate = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]); // padding
  };

 Date.prototype.toMYSQLDateTime = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]); // padding
  };

function getElementByScope(scope) {
	var elem = {};
	var id = scope.$id;
	$('.ng-scope').each(function(){
	    var s = angular.element(this).scope();
	    var sid = s.$id;
	    if(sid == id) {
	        elem = $(this);
	        return false; // stop looking at the rest
	    }
	});
	return elem;
}