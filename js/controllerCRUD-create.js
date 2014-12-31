
var app = angular.module("CRUD-create", []);

app.controller('CRUD-create-controller', function($scope, $rootScope, $http, $element, $attrs, $log, $filter) {
	/*
	$scope.GetTableSchema = function(){
		console.log("GetTableSchema() overrided by crud-create-controller ");
	}
	*/
	
	// type = crud type[create/read/update/delete]
	$scope.table.type = $attrs.type;
	
	// table = tableName
	$scope.table.name = $attrs.table;
	/*
	 *	defaultPath = [default/custom]
	 *		default = root/Templates/crud-type.html
	 *		custom 	= root/Templates/crud/crud-type-table.html
	 */
	$scope.defaultPath = $attrs.defaultPath;
	
	// table structure in array for default template use to repeat the form control
	/*
	 * format = {
	 *   "fieldName": {
	 *    "type": "int(10)",
	 *    "length": "10",
	 *    "null": 1,
	 *    "default": null
	 *	}, ...
	 * }
	 */
	//$scope.fields = {};
	
	/*
	 *	control the default template, hidden can hide the
	 *		columns, label will show 'display name' as form control's label
	 *	
	 *	label = {columnName:'display name'}
	 *	hidden = {'fieldName', 'field'}
	*/
	$scope.label = {};
	$scope.hidden = [];
	
	// store the date object of form control
	$scope.tempDate = {};
	$scope.tempDate.dateObject = {};
	$scope.tempDate.showResultString = {};
	
	// create store form control value
	//$scope.create = {};
	//var original = $scope.create;
	//$scope.create = angular.copy(original);
	/*
	$scope.sort = {}
	$scope.sort.predicate = '';
	$scope.sort.reverse = false;
	*/
	
	// get table schema($scope.fields) for create
	if($rootScope.table[$scope.table.name] == null){
		//$http.post($rootScope.controller+"simple-selectTableStructure.php", {table:$scope.table.name}).
		/*
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
								$scope.create[field.Field] = new Date();
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
			*/
		$log.debug("create controller call: GetTableSchema()");
		$log.debug($rootScope.table[$scope.table.name]);
		$scope.GetTableSchema($scope.table.type);
	}
	
	$scope.convertDateToString = function(fromModel, fieldName, type){
		var format = "";
		switch(type){
			case "date":
				format = "yyyy-MM-dd";
				break;
			case "datetime":
				format = "yyyy-MM-dd HH:mm:ss";
				break;
			case "timestamp":
				format = "yyyy-MM-dd HH:mm:ss";
				break;
			case "time":
				format = "HH:mm:ss";
				break;
		}
		$scope.create[fieldName] = $filter('date')(fromModel, format);  // for type="date" binding
	}
	
	$scope.createDefaultValue = angular.copy($scope.create);
	//console.log("Controller<crud crud-create-controller> - executed.");
	$log.info("Controller<crud crud-create-controller> - executed.");
});