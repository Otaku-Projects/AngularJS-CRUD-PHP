
var app = angular.module("CRUD-read", []);

app.controller('CRUD-read-controller', function($scope, $rootScope, $http, $element, $attrs, $log) {
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
	$scope.fields = {};
	
	/*
	 *	control the default template, hidden can hide the
	 *		columns, label will show 'display name' as form control's label
	 *	
	 *	label = {columnName:'display name'}
	 *	hidden = {'fieldName', 'field'}
	*/
	//$scope.label = {};
	//$scope.hidden = [];
	
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
		
	// get table structure for gen table tree node
	
	if($rootScope.table[$scope.table.name] == null){
		$log.debug("read controller call: GetTableSchema()");
		$log.debug($rootScope.table[$scope.table.name]);
		$scope.GetTableSchema($scope.table.type);
	/*
		$http(
			{
				method:"POST",
				url:$rootScope.controller+"simple-selectTableStructure.php",
				params:{table:$scope.table.name},
				responseType:'json'
			}).
			success(function(data, status, headers, config) {
				//console.dir(data);
				// this callback will be called asynchronously
				// when the response is available
				$scope.dataSchema = data.data;
				$rootScope.table[$scope.table.name] = data.data;
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				$scope.data = "fail";
			});
			*/
	}
	
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
			}).
			error(function(data, status, headers, config) {
				$scope.displayError = data;
				$scope.EnableRefreshButton();
			});
	}
	
	$scope.RefreshData();
	//console.log("Controller<crud crud-read-controller> - executed.");
	$log.info("Controller<crud crud-read-controller> - executed.");
});
