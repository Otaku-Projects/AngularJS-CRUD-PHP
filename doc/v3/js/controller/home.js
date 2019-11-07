"use strict";

app.controller('homeController', ['$scope', '$q', '$http', '$interval', '$rootScope', function ($scope, $q, $http, $interval, $rootScope) {
    var options = createCountUpOptions();
		
	$scope.start_milestones = function(){
        $scope.milstones_interval = $interval(function(){
            start_milestones($scope.stack);
        }, 7000)
	}
	
	// cancel $interval on leaving ui-state?
	// https://stackoverflow.com/questions/30938963/how-to-stop-interval-on-leaving-ui-state
	$scope.$on("$destroy",function(){
		if (angular.isDefined($scope.milstones_interval)) {
			$interval.cancel($scope.milstones_interval);
		}
	});
	
	$scope.get_milestones_information = function(){
		$scope.initial_variable();
	
		var getPrjectInfoResule = $scope.get_project_info();
		getPrjectInfoResule.then(function(infoObj) {
			$scope.stack.push(infoObj);
		}, function(reason) {
		});
		
		var getCommitInfoResule = $scope.get_github_commit_info();
		getCommitInfoResule.then(function(infoObjList) {
			//$scope.stack.push(infoObj);
			$scope.stack = $scope.stack.concat(infoObjList)
		}, function(reason) {
		});
		
		var getReleaseInfoResule = $scope.get_github_release_info();
		getReleaseInfoResule.then(function(infoObjList) {
			$scope.stack = $scope.stack.concat(infoObjList)
		}, function(reason) {
		});
		
		$q.all([getPrjectInfoResule, getCommitInfoResule, getReleaseInfoResule]).then(function() {
            start_milestones($scope.stack);
			$scope.start_milestones();
		});
	}
	$scope.get_project_info = function(){
		var options = createCountUpOptions();
		var promise = $q(function(resolve, reject) {
			var array = {text:"was borned in", amt:"2015", options};
			if(true){
				resolve(array);
			}else{
				reject(new Error('get project info error'));
			}
			
		});
		
		return promise;
	}
	$scope.get_github_commit_info = function(){
		var options = createCountUpOptions();
		var arrayList = [];
        
		var promise = $q(function(resolve, reject) {
			var array = {text:"commits", amt:"10101", options};
			
			$http({
				method : "GET",
				url : "https://api.github.com/repos/Otaku-Projects/AngularJS-CRUD-PHP/stats/contributors"
			}).then(function mySuccess(response) {
				var returnData = response.data;
				var totalContributorsCount = 0;
				var totalCommitsCount = 0;
				returnData.forEach(function(contributorsObj){
					totalContributorsCount+=1;
					totalCommitsCount+=contributorsObj.total;
				});
				arrayList.push({text:"Contributor(s)", amt:totalContributorsCount, options});
				arrayList.push({text:"Commits", amt:totalCommitsCount, options});
				resolve(arrayList);
			}, function myError(response) {
				reject(new Error('get project commit info error'));
			});
			
		});
		
		return promise;
	}
	$scope.get_github_release_info = function(){
		var options = createCountUpOptions();
		var arrayList = [];
        
		var promise = $q(function(resolve, reject) {
			var array = {text:"commits", amt:"10101", options};
			
			$http({
				method : "GET",
				url : "https://api.github.com/repos/Otaku-Projects/AngularJS-CRUD-PHP/releases"
			}).then(function mySuccess(response) {
				var returnData = response.data;
				var totalReleasesCount = 0;
				returnData.forEach(function(releasesObj){
					totalReleasesCount+=1;
				});
				
				if(returnData.length >0){
					arrayList.push({text:"Releases Count", amt:totalReleasesCount, options});
					
					var releasesObj = returnData[0];
					
					var url = $('<a/>', {
						text: releasesObj.tag_name,
						href: releasesObj.html_url,
						target: "_blanks"
					})
					var spanEnd = $('<span/>', {
						text: "."
					})
					$("#latest_release").html('The latest release ver. <i class="fas fa-tag fa-fw"></i> ').append(url);//.append(spanEnd);
				}
				resolve(arrayList);
			}, function myError(response) {
				reject(new Error('get project release info error'));
			});
			
		});
		
		return promise;
	}
    $scope.initial_variable = function(){
        $scope.stack = [];
    }
    function createCountUpOptions(){
		var options = {
			startVal: 1,
			duration: 1,
			useGrouping: false,
			separator: ',',
		};
        return options;
    }
	function start_milestones(stackObjectList){
        $("#milestones").html("");
        
        var infoObj = stackObjectList.shift();
        var elementContent = infoObj.text;
        var countUpAmt = infoObj.amt;
        var options = infoObj.options;
        $("#milestones").html("<div class='animated'>"+elementContent+"</div>");
        //$("#milestones div").animateCSS("fadeInUp");
        $("#milestones div").addClass("fadeInUp");
		
		//$("#count_up_amt_container").html('<span id="count_up_amt" style="display:none"></span>');
        
		if(!$scope.countUp){
			$scope.countUp = new CountUp("count_up_amt", 0, options);
			$scope.countUp.start();
			$("#count_up_amt").hide();
		}
		$("#count_up_amt").show();
		$scope.countUp.update(countUpAmt);
		
        
        stackObjectList.push(infoObj);
	}
	
	$scope.get_milestones_information();
}]);

