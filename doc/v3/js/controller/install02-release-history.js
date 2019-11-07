"use strict";

app.controller('install02Controller', ['$scope', '$q', '$http', '$interval', '$rootScope', function ($scope, $q, $http, $interval, $rootScope) {
	$(".release_info").hide();
	
	$scope.mergeContent = function(){
		if($scope.releaseInfoStack.length > 0){
			var latestRelease = $scope.latestVersion;
			console.dir(latestRelease)
			var tag_name = latestRelease.tag_name;
			var releaseZipDownloadURL = latestRelease.zipball_url;
			var releaseTarDownloadURL = latestRelease.tarball_url;
			
			// convert github release body content from Markdown to HTML
			var converter = new showdown.Converter();
			var markdown = latestRelease.body;
			
			// remove all Backslash
			// 92 is Backslash
			var findBackslash = String.fromCharCode(92)+String.fromCharCode(92); 
			var regularExpressBackslash = new RegExp(findBackslash, 'g');
			markdown = markdown.replace(regularExpressBackslash, '');
			
			// encode to html entities
			// https://stackoverflow.com/questions/18749591/encode-html-entities-in-javascript
			var encodedStr = markdown.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
			   return '&#'+i.charCodeAt(0)+';';
			});
			
			var html = converter.makeHtml(encodedStr);
			
			latestRelease.html = html;
			
			$("#latest_release_zip").text(tag_name).parent("a").attr("href", releaseZipDownloadURL);
			$("#latest_release_tar").text(tag_name).parent("a").attr("href", releaseTarDownloadURL);
			
			$(".loading_info").hide();
			$(".release_info").show();
		}
	}
	
	$scope.get_information = function(){
		$scope.initial_variable();
		
		var getReleaseInfoResule = $scope.get_github_release_info();
		getReleaseInfoResule.then(function(infoObjList) {
			$scope.releaseInfoStack = infoObjList;
			if(infoObjList.length > 0){
				$scope.latestVersion = infoObjList[0];
				$scope.previousVersion = infoObjList.slice(1);
			}
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
				//url : "https://api.github.com/repos/Otaku-Projects/AngularJS-CRUD-PHP/releases"
				url : "https://api.github.com/repositories/27926807/releases"
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
		$scope.latestVersion = [];
		$scope.previousVersion = [];
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