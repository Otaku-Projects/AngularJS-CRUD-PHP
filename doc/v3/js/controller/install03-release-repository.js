"use strict";

app.controller('install03Controller', ['$scope', '$q', '$http', '$interval', '$rootScope', '$stateParams', function ($scope, $q, $http, $interval, $rootScope, $stateParams) {
	$(".release_info").hide();
	
	$scope.releaseID = $stateParams.releaseID;
	
	$scope.mergeContent = function(){
		if($scope.latestVersion != null){
			var latestRelease = $scope.latestVersion;
			var tag_name = latestRelease.tag_name;
			var releaseZipDownloadURL = latestRelease.zipball_url;
			var releaseTarDownloadURL = latestRelease.tarball_url;
			
			$("#latest_release_zip").text(tag_name).parent("a").attr("href", releaseZipDownloadURL);
			$("#latest_release_tar").text(tag_name).parent("a").attr("href", releaseTarDownloadURL);
			
			$(".loading_info").hide();
			
			// convert github release body content from Markdown to HTML
			var converter = new showdown.Converter();
			//converter.setOption('backslashEscapesHTMLTags', 'true');
			var markdown = latestRelease.body;
			
			/*
			// replace \< to <, \> to >
			var findStartTag = "\<";
			var regularExpressStart = new RegExp(findStartTag, 'g');
			var findEndTag = "\>";
			var regularExpressEnd = new RegExp(findEndTag, 'g');
			markdown = markdown.replace(regularExpressStart, '<');
			markdown = markdown.replace(regularExpressEnd, '>');
			*/
			
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
			
			/*
			console.dir(latestRelease)
			console.dir(converter)
			console.dir(markdown)
			console.dir(encodedStr)
			console.dir(html)
			console.dir(latestRelease)
			*/
			
			$(".release_info").show();
		}
	}
	
	$scope.get_information = function(){
		$scope.initial_variable();
		
		var getReleaseInfoResule = $scope.get_github_release_info($scope.releaseID);
		getReleaseInfoResule.then(function(infoObjList) {
			if(infoObjList.length > 0){
				$scope.latestVersion = infoObjList[0];
			}
		}, function(reason) {
		});
		
		$q.all([getReleaseInfoResule]).then(function() {
			$scope.mergeContent();
		});
	}
	$scope.get_github_release_info = function(releaseID){
		var arrayList = [];
        
		var promise = $q(function(resolve, reject) {
			var array = {text:"commits", amt:"10101", options};
			
			$http({
				method : "GET",
				//url : "https://api.github.com/repos/Otaku-Projects/AngularJS-CRUD-PHP/releases/"+releaseID
				url : "https://api.github.com/repositories/27926807/releases/"+releaseID
			}).then(function mySuccess(response) {
				var returnData = response.data;
				var totalReleasesCount = 0;
				/*
				returnData.forEach(function(releasesObj){
					arrayList.push(releasesObj);
				});
				*/
				arrayList.push(returnData);
				
				resolve(arrayList);
			}, function myError(response) {
				reject(new Error('get project release info error'));
			});
			
		});
		
		return promise;
	}
    $scope.initial_variable = function(){
		$scope.latestVersion = null;
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