// loading other javascript files in synchronize
var siteRoot = webRoot + "/";
var loadJsList = [];
loadJsList.push(siteRoot+"archive/2.8.x/js/common.js");
loadJsList.push(siteRoot+"archive/2.8.x/js/date.matt.kruse.js");

loadJsFiles(loadJsList);
function loadJsFiles(loadJsList){
	loadJsList.forEach(function(element) {
        // console.dir("dynamic load:"+element)
		$.ajax({
			async: false,
			url: element,
			dataType: "script"
		});
	});
}