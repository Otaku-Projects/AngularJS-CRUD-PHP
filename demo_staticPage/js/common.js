// JavaScript Document
"use strict";

// jQuery conflict with native prototype.
/*
String.prototype.IsNullOrEmpty = function(){
	var curStr = this;
	var isNullOrEmpty = false;
	if(typeof(curStr) == "undefined")
		isNullOrEmpty = true;
	else if(curStr == null)
		isNullOrEmpty = true;
	else if(curStr == "")
		isNullOrEmpty = true;
	return isNullOrEmpty;
}

Object.prototype.IsEmpty = function(){
	var obj = this;
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop))
			return false;
	}

	return true;
}
*/

// fixed: http://stackoverflow.com/questions/32169408/userscript-issue-with-object-prototype
// String.defineProperty(String.prototype, 'IsNullOrEmpty', {
//   value : function() {
// 	  	var curStr = this;
// 		var isNullOrEmpty = false;
// 		if(typeof(curStr) == "undefined")
// 			isNullOrEmpty = true;
// 		else if(curStr == null)
// 			isNullOrEmpty = true;
// 		else if(curStr == "")
// 			isNullOrEmpty = true;
// 		return isNullOrEmpty;
// 	},
//   enumerable : false
// });

Object.defineProperty(Object.prototype, 'IsEmptyObject', {
  value : function() {
		var obj = this;
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				return false;
		}
	
		return true;
	},
  enumerable : false
});
String.prototype.IsNullOrEmpty = function(){
	  	var curStr = this;
		var isNullOrEmpty = false;
		if(typeof(curStr) == "undefined")
			isNullOrEmpty = true;
		else if(curStr == null)
			isNullOrEmpty = true;
		else if(curStr == "")
			isNullOrEmpty = true;
		return isNullOrEmpty;
}
String.prototype.ReplaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function getFunctionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}