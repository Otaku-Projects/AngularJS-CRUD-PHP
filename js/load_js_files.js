// loading other javascript files in synchronize
var siteRoot = webRoot + "/";
var loadJsList = [];
loadJsList.push(siteRoot+"js/common.js");
loadJsList.push(siteRoot+"js/date.matt.kruse.js");

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