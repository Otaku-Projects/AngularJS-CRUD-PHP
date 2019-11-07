"use strict";

app.controller('install01Controller', ['$scope', '$q', '$http', '$interval', '$rootScope', function ($scope, $q, $http, $interval, $rootScope) {
	$("#download_button").hide();
	
	$scope.mergeContent = function(){
		if($scope.releaseInfoStack.length > 0){
			var latestRelease = $scope.releaseInfoStack[0];
			console.dir(latestRelease)
			var tag_name = latestRelease.tag_name;
			var releaseZipDownloadURL = latestRelease.zipball_url;
			var releaseTarDownloadURL = latestRelease.tarball_url;
			
			$("#latest_release_zip").text(tag_name).parent("a").attr("href", releaseZipDownloadURL);
			$("#latest_release_tar").text(tag_name).parent("a").attr("href", releaseTarDownloadURL);
			
			$("#loading_info").hide();
			$("#download_button").show();
		}
	}
	
	$scope.get_information = function(){
		$scope.initial_variable();
		
		var getReleaseInfoResule = $scope.get_github_release_info();
		getReleaseInfoResule.then(function(infoObjList) {
			$scope.releaseInfoStack = infoObjList;
		}, function(reason) {
		});
		
		$q.all([getReleaseInfoResule]).then(function() {
			$scope.mergeContent();
		});
	}
	$scope.get_github_release_info = function(){
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
					arrayList.push(releasesObj);
				});
				
				resolve(arrayList);
			}, function myError(response) {
				reject(new Error('get project release info error'));
			});
			
		});
		
		return promise;
	}
    $scope.initial_variable = function(){
        $scope.releaseInfoStack = [];
    }
	function start_milestones(stackObjectList){
        $("#milestones").html("");
        
        var infoObj = stackObjectList.shift();
        var elementContent = infoObj.text;
        var countUpAmt = infoObj.amt;
        var options = infoObj.options;
        $("#milestones").html("<div class='animated'>"+elementContent+"</div>");
        $("#milestones div").addClass("fadeInUp");
        
		if(!$scope.countUp){
			$scope.countUp = new CountUp("count_up_amt", 0, options);
			$scope.countUp.start();
			$("#count_up_amt").hide();
		}
		$("#count_up_amt").show();
		$scope.countUp.update(countUpAmt);
		
        stackObjectList.push(infoObj);
	}
	
	$scope.get_information();
}]);