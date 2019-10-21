// JavaScript Document
"use strict";

// https://stackoverflow.com/questions/3280323/get-week-of-the-month
// return integer means the date in the which week of month
// 6 means "Last", not "Sixth"
// pass true to return the actual week of month
Date.prototype.getWeekOfMonth = function(exact) {
    var month = this.getMonth()
        , year = this.getFullYear()
        , firstWeekday = new Date(year, month, 1).getDay()
        , lastDateOfMonth = new Date(year, month + 1, 0).getDate()
        , offsetDate = this.getDate() + firstWeekday - 1
        , index = 0 // start index at 0 or 1, your choice
        , weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
        , week = index + Math.floor(offsetDate / 7)
    ;
    if (exact || week < 2 + index) return week;
    return week === weeksInMonth ? index + 5 : week;
};

// https://stackoverflow.com/questions/7423801/given-a-weekday-and-the-day-of-the-month-it-occurs-can-i-get-its-ordinal-positi
// https://stackoverflow.com/questions/28162140/how-to-find-ordinal-position-of-any-given-weekday-in-javascript/28163096#28163096
Date.prototype.nthofMonthStr = function(){
    var today= this.getDate(),m=this.getMonth(),
    day= ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday'][this.getDay()],
    month= ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'][m];
    return [(m+1)+'-'+today,'the', (Math.ceil((today)/7)).nthStr(), day, 'of', month, 'in', this.getFullYear()].join(' ');
}
Date.prototype.nthofMonth = function(){
    var today= this.getDate(),m=this.getMonth(),
    day= ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday'][this.getDay()],
    month= ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'][m];
    return (Math.ceil((today)/7));
}
Number.prototype.nthStr = function(){
    var n= Math.round(this), t= Math.abs(n%100), i= t%10;
    if(i<4 && (t<4 || t> 20)){
        switch(i){
            case 1:return n+'st';
            case 2:return n+'nd';
            case 3:return n+'rd';
        }
    }
    return n+'th';
}

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