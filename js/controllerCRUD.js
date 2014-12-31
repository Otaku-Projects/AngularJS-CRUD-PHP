var app = angular.module("myApp", ["CRUD-create", "CRUD-read", "CRUD-update", "CRUD-delete"], function($httpProvider, $provide, $injector) {
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
	var host = window.location.hostname;
	var href = window.location.href;
	href = href.toLowerCase();
	
	$rootScope.webRoot = "//localhost/";
	$rootScope.controller = $rootScope.webRoot+"controller/";
	$rootScope.webTemplates = $rootScope.webRoot+"Templates/";
	
	$rootScope.isDebug = true;
	//$log.log("test");
});

app.controller('CRUD-container', function($scope, $rootScope, $http, $element, $attrs, $log, $timeout) {
	$scope.screenMessage = {};
	$scope.error = [];
	$scope.table = {};
	$scope.action = "";
	$scope.form = {};
	$scope.form.name = "";
	
	$scope.dataSchema = {}; // format = describe table
	$scope.fields = {}; // format similar as $scope.dataSchema
	
	$scope.create = {};
	$scope.createDate = {};
	$scope.createDefaultValue = {};
	/*
	$scope.createStatus = {};
	$scope.createStatus.isCreateSuccess = false;
	$scope.createStatus.lockControl = false;
	*/
	$scope.submitStatus = {};
	//$scope.submitStatus.isSubmitSuccess = false;
	//$scope.submitStatus.lockControl = false;
	
	$scope.updateFrom = {};
	$scope.updateTo = {};
	$scope.updateStatus = {};
	//$scope.updateStatus.isUpdateSuccess = false;
	//$scope.updateStatus.lockControl = false;

	// delete is a reserved word in javascript =[
	//$scope.deleteData = {};
	
	
	$scope.test = function(){
		//$scope.createStatus.lockControl = !$scope.createStatus.lockControl;
		$scope.submitStatus.lockControl = true;

		// it must use $timeout instead of setTimeOut(function(){...})
			$timeout(function(){
				//$scope.AfterTheMessage();
				$scope.submitStatus.lockControl = false;
			}, 3000);
	}

	$scope.UnlockFormContorl = function(){
		$scope.submitStatus.lockControl = false;
		console.log("HERE");
	}
	$scope.LockFormContorl = function(){
		$scope.submitStatus.lockControl = true;
	}

	$scope.Submit = function(relatedData){
		var crud_type = $scope.table.type;
		/*
		var isCreateSuccess = false;
		$scope.createStatus.isCreateSuccess = false;
		$scope.createStatus.lockControl = true;
		$scope.createStatus.keyValue = {};
		*/
		//$scope.submitStatus.isCreateSuccess = false;
		$scope.submitStatus.isSubmitSuccess = false;
		$scope.submitStatus.lockControl = true;
		$scope.submitStatus.keyValue = {};
		
		$scope.formData = {};
		switch(crud_type){
			case "create":
				$scope.formData = $scope.create;
				break;
			case "read":
				break;
			case "update":
				$scope.formData.from = $scope.updateFrom;
				$scope.formData.to = $scope.updateTo;
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
				  //console.log("control: "+formControlName, +", type:"+schemaDetails.Type+", value:"+formControlValue);
				  $log.warn("is date/time field checking. control: "+formControlName, +", type:"+schemaDetails.Type+", value:"+formControlValue);
				  if(modelTypeOf=="object"){
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
				  }else{
					//console.log("typeof is not a object, not need convert date to string")
					$log.warn("typeof is not a object, not need convert date to string")
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

		var ajaxResult = $http.post($scope.action, sendData);
		ajaxResult.success(function(data){
			var tempIsSuccess = false;
					switch(crud_type){
						case "create":
							var insert_id = parseInt(data.insert_id);
							var affected_rows = parseInt(data.affected_rows);
							if(insert_id > 0 && affected_rows > 0){
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
								//$("#"+$scope.table.name+"-back-to-table").trigger('click');
								$("#"+$scope.table.name+"-refresh-data").trigger('click');
								tempIsSuccess = true;
							}
							else{
							}
							break;
						case "delete":
							$log.debug(data)
							var affected_rows = parseInt(data.affected_rows);
							$log.debug("delete result, affected_rows: "+affected_rows)
							if(affected_rows>0){
								//$("#"+$scope.table.name+"-back-to-table").trigger('click');
								$("#"+$scope.table.name+"-refresh-data").trigger('click');
								tempIsSuccess = true;
							}
							else{
							}
							break;
					}
			$scope.submitStatus.isSubmitSuccess = tempIsSuccess;
			// it must use $timeout instead of setTimeOut(function(){...})
			$timeout(function(){
				$scope.AfterTheMessage();
			}, 3000);
		});
		ajaxResult.error(function(data){
			$scope.submitStatus.lockControl = false;
		});

		$scope.AfterTheMessage = function(){
			$scope.submitStatus.isSubmitSuccess = false;
			$scope.UnlockFormContorl();
			//$scope.submitStatus.lockControl = false;
			switch(crud_type){
				case "create":
					$scope.ResetCreateForm();
					$("#"+$scope.table.name+"-refresh-data").trigger('click');
					break;
				case "update":
					$("#"+$scope.table.name+"-back-to-table").trigger('click');
					$("#"+$scope.table.name+"-refresh-data").trigger('click');
					//$scope.updateFrom = angular.copy($scope.updateTo);
					break;
				case "delete":
					break;
			}
		}
			/*
			$scope.submitStatus.isSubmitSuccess = ajaxResult.success(function(data) {
					switch(crud_type){
						case "create":
							var insert_id = parseInt(data.insert_id);
							var affected_rows = parseInt(data.affected_rows);
							if(insert_id > 0 && affected_rows > 0){
								for(key in $scope.formData){
									$scope.submitStatus.keyValue[0] = $scope.formData[key];
									break;
								}
								return true;
							}
							break;
						case "update":
							$log.debug(data)
							var affected_rows = parseInt(data.affected_rows);
							$log.debug(affected_rows)
							if(affected_rows>0){
								//$("#"+$scope.table.name+"-back-to-table").trigger('click');
								$("#"+$scope.table.name+"-refresh-data").trigger('click');
								return true;
							}
							else{
								return false;
							}
							break;
						case "delete":
							return true;
							break;
					}
					$scope.submitStatus.lockControl = false;
					return false;
				})
			*/
			/*
			if($scope.submitStatus.isSubmitSuccess){
				setTimeout(function(){
					$scope.submitStatus.isSubmitSuccess = false;
					console.log("try to click the refresh data btn. refresh table: "+$scope.table.name)
					//angular.element("#"+$scope.table.name+"-refresh-data").trigger('click');
					switch(crud_type){
						case "create":
							$scope.ResetCreateForm();
							break;
						case "update":
							$("#"+$scope.table.name+"-back-to-table").trigger('click');
							$("#"+$scope.table.name+"-refresh-data").trigger('click');
							//$scope.updateFrom = angular.copy($scope.updateTo);
							break;
						case "delete":
							break;
					}
					// reslease the form controls lock
					$scope.submitStatus.lockControl = false;
				}, 5000);
			}
			*/
	}

/*
	$scope.$watch("submitStatus", function(newValue, oldValue) {
		if(newValue.isSubmitSuccess){
			setTimeout(function(){
				newValue.isSubmitSuccess = false;
				$scope.submitStatus.isSubmitSuccess = false;
			}, 3000);
		}
  });
	*/

	$scope.ClearCreateForm = function(){
		/*
		angular.forEach( $scope.create, function(value, index){
			$scope.create[index] = null;
		});
		*/
	}
	$scope.ResetCreateForm = function(){
		$scope.create = angular.copy($scope.createDefaultValue);
	}
	$scope.CreateSuccess = function(){
	}
	
	$scope.GetTableSchema = function(crudType){
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
				$scope.dataSchema = data.data;
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
					if(columnType.indexOf("(") >-1){
						$scope.fields[field.Field]["length"] = field.Type.substring(field.Type.indexOf('(')+1, field.Type.indexOf(')') );
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
				$rootScope.table[$scope.table.name] = data.data;
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				$scope.data = "fail";
			});
	}
	
	//console.log("Controller<div crud-container> - executed.");
	$log.info("Controller<div crud-container> - executed.");
});

// define the <crud> tag
app.directive('crud', function($rootScope, $log) {
    return {
      restrict: 'E',
      scope: true, // set true for shared parent scope, set scope:{}, isolate scope
      controller: "@",
	  name: "controller",	  
	  templateUrl: function(elem, attrs){
		var defaultPath = $rootScope.webTemplates//;+"crud-"+attrs.type+".html";
		var customPath = $rootScope.webTemplates+"crud/crud-"+attrs.type+"-"+attrs.table+".html";
		var targetPath = "";
		var folderName = "";
		var templateName = "crud-"+attrs.type+".html";
		switch(attrs.defaultPath){
			case "default": // default template
				//targetPath = defaultPath + folderName + "crud-"+attrs.type+".html";
				break;
			case "batch": // view in batch
				folderName = "batch/";
				break;
			case "individual": // create / read / update / delete in individual record
				folderName = "individual/";
				break;
			case "auto": // create / read / update / delete mode are auto detect
				folderName = "auto_mode/";
				break;
			case "custom":
				//targetPath = customPath;
				folderName = "crud/";
				templateName = "crud-"+attrs.type+"-"+attrs.table+".html";
				break;
			default:
				targetPath = defaultPath;
				break;
		}
		targetPath = defaultPath + folderName + templateName;

		//console.log("Directive<crud>| templateUrl - template URL generated: "+targetPath);
		$log.info("Directive<crud> | templateUrl() - template URL generated: " + targetPath);
		  return targetPath;
	  },
	  link: function(scope, elem, attrs){
		//console.log("Directive<crud>| link");
		$log.info("Directive<crud> | link()");
	  }
	};
})
  
  /*
  app.directive(
    'dateInput',
    function(dateFilter) {
        return {
            require: 'ngModel',
            template: '<input type="date"></input>',
            replace: true,
            link: function(scope, elm, attrs, ngModelCtrl) {
                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    return dateFilter(modelValue, 'yyyy-MM-dd');
                });

                ngModelCtrl.$parsers.unshift(function(viewValue) {
                    return new Date(viewValue);
                });
            },
        };
});
*/
  
// define the integer attribute for input control
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