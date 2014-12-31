
var app = angular.module("CRUD-delete", []);

app.controller('CRUD-delete-controller', function($scope, $rootScope, $http, $element, $attrs, $log, $filter) {

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
	
	$scope.formData = $scope.read;
	
	$scope.displayData = {};
	$scope.displayError = {};
	
	// table sortable function
	$scope.sort = {}
	$scope.sort.predicate = '';
	$scope.sort.reverse = false;
	
	$scope.showCol = {};
	
	$scope.isUpdateFormUnchange = false;

	$scope.submitStatus.deleteConfirmation = false;
		
	// get table structure for gen table tree node
	
	if($rootScope.table[$scope.table.name] == null){
		$scope.GetTableSchema($scope.table.type);
	}
	
	$scope.DisableRefreshButton = function(){
		$scope.updateStatus.disableRefresh = true;
		$scope.updateStatus.refreshingData = true;
	}
	
	$scope.EnableRefreshButton = function(){
		$scope.updateStatus.disableRefresh = false;
		$scope.updateStatus.refreshingData = false;
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
	
	$scope.test = function(){
		//$log.log($scope.updateTo)
		//$log.log($scope.updateFrom)
		$scope.isFormUnchange();
	}

	$scope.DeleteRecord = function(deleteThisRecord){
 		$log.log("start delete one record function here.");
	    $scope.submitStatus.deleteConfirmation = confirm($scope.screenMessage.deleteConfirmation);
	    //$log.log(deleteThisRecord)
	    if($scope.submitStatus.deleteConfirmation){
	    	//$scope.deleteData = deleteThisRecord;
	    	$scope.Submit(deleteThisRecord);
	    }
	}
	
	$scope.CloneForUpdate = function(updateDataPack){
		$scope.Update = "Y";
		
		angular.forEach( $scope.dataSchema, function( field, fieldIndex  ) {
			var fieldName = field.Field;
			
			var value = updateDataPack[fieldName]
			var columnType = $scope.fields[fieldName].type//$scope.fields[name]['type'];
			var isTrouble = false;
			var dateInText = value;
			
			switch(columnType){
				case "date":
				case "datetime":
				case "timestamp":
				case "time":
					isTrouble = true;
					$log.debug("type: "+typeof(value)+", value: "+value)
					break;
			}
			
			if(isTrouble){
				//var tempDate = new Date();
				
				var tempYear = 1900;
				var tempMonth = 0;
				var tempDay = 1;
				var tempHours = 23;
				var tempMinutms = 59;
				var tempSeconds = 59;
				
				var firstColonIndex = 0;
				var lastColonIndex = 0;
				
				var firstDashIndex = 0;
				var lastDashIndex = 0;
				
				switch(columnType){
					case "datetime":
					case "timestamp":
						firstDashIndex = dateInText.indexOf("-");
						lastDashIndex = dateInText.indexOf("-", firstDashIndex+1);
					
						tempYear = dateInText.substr(0,4);
						tempMonth = dateInText.substr(firstDashIndex+1,2);
						tempDay = dateInText.substr(lastDashIndex+1,2);
						
						tempSeconds = dateInText.slice(-2)
						lastColonIndex = dateInText.lastIndexOf(":");
						firstColonIndex = dateInText.indexOf(":");
						
						tempMinutms = dateInText.substr(firstColonIndex+1,2);
						
						tempHours = dateInText.substr(firstColonIndex-2,2);
					case "date":
						firstDashIndex = dateInText.indexOf("-");
						lastDashIndex = dateInText.indexOf("-", firstDashIndex+1);
					
						tempYear = dateInText.substr(0,4);
						tempMonth = dateInText.substr(firstDashIndex+1,2);
						tempDay = dateInText.substr(lastDashIndex+1,2);
						break;
					case "time":
						isTrouble = true;
						break;
				}
				
				tempMonth = parseInt(tempMonth)-1;
				tempDay = parseInt(tempDay);
				
				tempHours = parseInt(tempHours);
				tempMinutms = parseInt(tempMinutms);
				tempSeconds = parseInt(tempSeconds);
				
				/*
				tempDate.setFullYear(tempYear);
				tempDate.setMonth(tempMonth);
				tempDate.setDate(tempDay);
				
				tempDate.setHours(tempHours);
				tempDate.setMinutes(tempMinutms);
				tempDate.setSeconds(tempSeconds);
				*/
				
				//$scope.updateTo[name] = new Date();
				//$scope.updateTo[name] = tempDate;
				
				$scope.tempDate['dateObject'][fieldName] = new Date(tempYear, tempMonth, tempDay, tempHours, tempMinutms, tempSeconds);
				
				$log.log($scope.tempDate['dateObject'][fieldName])
				/*
				$scope.updateTo[fieldName].year = tempYear;
				$scope.updateTo[fieldName].month = tempMonth;
				$scope.updateTo[fieldName].day = tempDay;
				
				$scope.updateTo[fieldName].hours = tempHours;
				$scope.updateTo[fieldName].minutms = tempMinutms;
				$scope.updateTo[fieldName].seconds = tempSeconds;
				
				console.dir($scope.updateTo[fieldName])
				console.log($scope.updateTo[fieldName].year)
				*/
				$scope.convertDateToString($scope.tempDate['dateObject'][fieldName], fieldName, columnType);
			}else{
				//$scope.updateFrom[fieldName] = value;
				$scope.updateTo[fieldName] = value
			}
		});
		
		$scope.updateFrom = angular.copy(updateDataPack);
	}
		$scope.isFormUnchange = function(){
			var isFormChanged = angular.equals($scope.updateFrom, $scope.updateTo);
			// may be we need to handle the null equal to empty problem?
			/*
			if(!isFormChanged){
				var isSame = true;
				for(index in $scope.updateFrom){
					if($scope.updateFrom[index]==null){
						if($scope.updateTo == null || $scope.updateTo==""){
							isSame = true;
						}else{
							isSame = false;
						}
					}
				}
				isFromChanged = isSame;
			}
			*/
			return isFormChanged;
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
		$scope.updateTo[fieldName] = $filter('date')(fromModel, format);  // for type="date" binding
	}
	
	$scope.RefreshData();
	//console.log("Controller<crud crud-read-controller> - executed.");
	$log.info("Controller<crud crud-read-controller> - executed.");
});
