
var app = angular.module("CRUD-create", []);

app.controller('CRUD-create-controller', function($scope, $rootScope, $http, $element, $attrs, $log, $filter) {
	// type = crud type[create/read/update/delete]
	//$scope.table.type = $attrs.type;
	
	// table = tableName
	//$scope.table.name = $attrs.table;

	$scope.GetCRUDActionType($attrs);
	
	/*
	 *	control the default template, hidden can hide the
	 *		columns, label will show 'display name' as form control's label
	 *	
	 *	label = {columnName:'display name'}
	 *	hidden = {'fieldName', 'field'}
	*/
	$scope.label = {};
	$scope.hidden = [];
	
	// move to controllerCRUD
	// store the date object of form control
	//$scope.tempDate = {};
	//$scope.tempDate.dateObject = {};
	//$scope.tempDate.showResultString = {};
	
	// create store form control value
	//$scope.create = {};
	//var original = $scope.create;
	//$scope.create = angular.copy(original);
	
	// get table schema($scope.fields) for create
	if(typeof($rootScope.table[$scope.table.name]) == "undefined" ){
		$rootScope.table[$scope.table.name] = $scope.GetTableSchema($scope.table.type);
	}

	/*
	 *	When the same get table schema request are sent and wait for the response,
	 *	the next same name of table schema request will not sent, now will watch and
	 *	wait for the response.
	 */
	$rootScope.$watch(
		function($rootScope){
			return $rootScope.tableSource[$scope.table.name];
		}, function(newVal, oldVal){
		if(typeof(newVal) != "undefined" ){
			if(typeof(newVal)=="string"){
				if(newVal != null && newVal!=""){
					$scope.ConvertSchema2Fields(newVal)
				}
			}else{
				$scope.ConvertSchema2Fields(newVal)
			}
		}
	})
	
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