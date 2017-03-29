
var app = angular.module("CRUD-read", []);

app.controller('CRUD-read-controller', function($scope, $rootScope, $http, $element, $attrs, $log) {
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
	
	$scope.formData = $scope.read;
	
	$scope.displayData = {};
	$scope.displayError = {};
	
	// table sortable function
	$scope.sort = {}
	$scope.sort.predicate = '';
	$scope.sort.reverse = false;
	
	$scope.showCol = {};
	
	$scope.readStatus = {}
	$scope.readStatus.disableRefresh = false;
	
	$scope.FirstReadFinished = false;
		
	// get table structure for gen table tree node
	if(typeof($rootScope.table[$scope.table.name]) == "undefined"){
		$scope.GetTableSchema($scope.table.type);
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
	
	$scope.DisableRefreshButton = function(){
		$scope.readStatus.disableRefresh = true;
		$scope.readStatus.refreshingData = true;
	}
	
	$scope.EnableRefreshButton = function(){
		$scope.readStatus.disableRefresh = false;
		$scope.readStatus.refreshingData = false;
	}
		
	// get Database records
	$scope.RefreshData = function(haha){
		$scope.DisableRefreshButton();
		$http(
			{
				method	:	"POST",
				url		:	$rootScope.controller+"simple-selectTableRecord.php",
				params	:	{"table":$scope.table.name, 'crud-type':$scope.table.type},//, "create":$scope.formData},
				responseType	:	'json'
			}).
			success(function(data, status, headers, config) {
				$scope.displayData = data.data;
				$scope.EnableRefreshButton();
				$scope.FirstReadFinished = true;
			}).
			error(function(data, status, headers, config) {
				$scope.displayError = data;
				$scope.EnableRefreshButton();
				$scope.FirstReadFinished = true;
			});
	}
	
	
	$rootScope.$watch(
		function(){return $rootScope.getSchemaStatus[$scope.table.name]},
		function(newValue, oldValue){
			if ( newValue !== oldValue )
			if($rootScope.getSchemaStatus[$scope.table.name]=="ok"){
				$scope.RefreshData();
			}else{
				console.warn("Read Controller: ");
				console.warn("Obtain table structure 'fail', cancel to read data from table "+$scope.table.name);
			}
		}
	);
	
	$log.info("Controller<crud crud-read-controller> - executed.");
});
