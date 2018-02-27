// JavaScript Document
"use strict";

/**
 * <pageview> a view element for a set of records, display the record in pagination.
 * <pageview
    ng-model=""
    program-id=""
    edit-mode=""
    >
 * @param {Object} ng-model - store the data record, the data record may used in CRUD
 * @param {String} program-id - assign the program id to implement the behavior of CRUD
 * @param {String} edit-mode - define the mode [create | view | amend | delete |]
 */
app.directive('pageview', ['$rootScope', 
    '$timeout', 
    '$compile',
    '$q',
    'Core', 
    'Security', 
    'LockManager', 
    'HttpRequeset',
    'MessageService',
    'ThemeService',
    'TableManager',
    'DataAdapter', function($rootScope, $timeout, $compile, $q, Core, Security, LockManager, HttpRequeset, MessageService, ThemeService, TableManager, DataAdapter) {
    function PageViewConstructor($scope, $element, $attrs) {
        if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("1 Pageview - PageViewConstructor()");
        
        var constructor = this;
        var $ctrl = $scope.pageviewCtrl;
        var tagName = $element[0].tagName.toLowerCase();

        var recordStructure = {};

        function LockAllControls(){
            LockManager.LockAllControls($element, "pageview");
        }
        function UnLockAllControls(){
            LockManager.UnLockAllControls($element,"pageview");
        }

        function InitializePageView() {
            // check attribute programId
            var isProgramIdFound = false;
            if(typeof($attrs.programId) != undefined){
                if($attrs.programId != null && $attrs.programId !=""){
                    isProgramIdFound = true;
                }
            }
            if(isProgramIdFound){
                $scope.programId = $attrs.programId;
            }
            else{
                // console.trace();
                var isParentScopeFromEditbox = false;
                if(typeof ($scope.$parent.SetEditboxNgModel) == "function")
                    isParentScopeFromEditbox = true;

                if(!isParentScopeFromEditbox)
                   alert("<pageview> Must declare a attribute of program-id");
            }
            // check attribute PageRecordsLimit
            var isPageRecordsLimit = false;
            var pageRecordsLimit = $attrs.pageRecordsLimit;
            if(typeof(pageRecordsLimit) != undefined){
                if((pageRecordsLimit != null && pageRecordsLimit !="") || !isNaN(pageRecordsLimit)){
                    pageRecordsLimit = parseInt(pageRecordsLimit);
                    isPageRecordsLimit = true;
                }
            }
            if(isPageRecordsLimit){
                $scope.numOfRecordPerPage = pageRecordsLimit;
            }
            else{
                if(Core.GetConfig().debugLog.DirectiveFlow)
                Core.SysLog.Print("PageRecordsLimitDefault", "10", $element[0].tagName, "PageRecordsLimitDefault");
                $scope.numOfRecordPerPage = 10;
            }

            $scope.tableStructure = {};
            $scope.criteriaObj = {};

            // Declare $scope.variable
            $scope.dataSource = []; // [{}, {}]
            $scope.sortedDataSource = []; // [{}, {}]
            $scope.currentPageRecords = {}; // [{}, {}]
            $scope.mousehoverRecord = {}; // mousehover's record
            $scope.pointedRecord = {}; // mouse clicked record
            $scope.selectedRecord = {}; // user tick to selected record

            $scope.maxRecordsCount = -1;

            $scope.lastPageNum = -1;

            $scope.pageNum = 0;

            $ctrl.ngModel = {};
            // $ctrl.ngModel = $scope.currentPageRecords;

            $scope.DisplayMessage = "";

            $scope.getNextPageTimes = 0;
        }

        function EventListener(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            Core.SysLog.Print("PageviewEventListener", $scope.$id, $element[0].tagName, "PageviewEventListener");
        }
        function ValidateRecord(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            Core.SysLog.Print("PageviewValidateRecord", $scope.$id, $element[0].tagName, "PageviewValidateRecord");
            return true;
        }
        function CustomGetDataResult(data_or_JqXHR, textStatus, jqXHR_or_errorThrown){
            var progID = $scope.programId;
        }

        function SetRecordStructure(dataJson){
            $scope.tableStructure = dataJson;
            
            // if structure already defined, escape the function
            if(!jQuery.isEmptyObject(recordStructure)){
                return;
            }
            var dataColumns = $scope.tableStructure.DataColumns;

            for(var columnName in dataColumns){
                var column = dataColumns[columnName];

                var isSystemField = Core.IsSystemField(columnName);
                if(isSystemField)
                    continue;

                // is column exists in ngModel
                if(typeof(recordStructure[columnName]) == "undefined"){
                    recordStructure[columnName] = column.default;
                }
            }
        }
        
        function GetTableStructure(){
            var programId = $scope.programId.toLowerCase();
            var submitData = {
                "Table": programId
            };
            var tbResult = TableManager.GetTableStructure(submitData);
            tbResult.then(function(responseObj) {
                SetRecordStructure(responseObj);
            }, function(reason) {

            }).finally(function() {
                // Always execute this on both error and success
            });
            
            return tbResult;
        }
        function AppendToDataSource(pageNum, dataJson){
            var singleItem;
            var dataColumns = $scope.tableStructure.DataColumns;
            var numOfRecordPerPage = $scope.numOfRecordPerPage;

            var recordNumberStart = (pageNum - 1) * numOfRecordPerPage;
            var recordNumberEnd = pageNum * numOfRecordPerPage - 1;

            var currentPageArray = [];
            var dataSourceArray = jQuery.extend([], $scope.dataSource);
            // 20170112, keithpoon, fixed: total records count less than a page, delete one record in database and than refresh in pageview, the record set display incorrect
            if(dataSourceArray.length < $rootScope.serEnv.phpRecordLimit)
                dataSourceArray = [];

            var counter = recordNumberStart;
            // add each getted row into DataSource
            for(var itemRow in dataJson){
                var singleItem = dataJson[itemRow];
                var newRecordRow = jQuery.extend({}, recordStructure);

                for(var columnName in dataColumns){
                    var column = dataColumns[columnName];
                    var colDataType = column.type;

                    var isSystemField = Core.IsSystemField(columnName);
                    if(isSystemField)
                        continue;

                    var newColumn = newRecordRow[columnName];

                    if (colDataType == "date"){
                        newColumn = new Date(singleItem[columnName]);
                    }else if (colDataType == "double"){
                        newColumn = parseFloat(singleItem[columnName]);
                    }else{
                        newColumn = singleItem[columnName];
                    }

                    newRecordRow[columnName] = newColumn;
                } // columns end
                //dataSourceArray[counter] = newRecordRow;
                currentPageArray.push(newRecordRow);
                counter++;

                // append the item records
                newRecordRow.Items = singleItem.Items;
            }
            // 20180205, fixed: always trust the get data result, and reasign the to the data source list
            // fixed bug case:
            // data source have records that more than a page,
            // the webpage delete a record and call clear and refresh
            // the pageview not update the data source becuase the array index was found, 
            dataSourceArray.splice.apply(dataSourceArray, [recordNumberStart, numOfRecordPerPage].concat(currentPageArray));

            $scope.dataSource = jQuery.extend([], dataSourceArray);
        }
        function SortingTheDataSource(){
            $scope.sortedDataSource = jQuery.extend([], $scope.dataSource);
        }

        function GetRecordStructure(){
            var aCopyOfRecordStructure = jQuery.extend({}, recordStructure);
            return aCopyOfRecordStructure;
        }

        function TryToCallInitDirective(){
            if(typeof $scope.InitDirective == "function"){
                $scope.InitDirective($scope, $element, $attrs, $ctrl);
            }else{
                $scope.DefaultInitDirective();
            }
        }
        function TryToCallSetCriteriaBeforeGet(pageNum, lastRecordIndex, criteriaObj){
            if(typeof $scope.SetCriteriaBeforeGet == "function"){
                criteriaObj = $scope.SetCriteriaBeforeGet(pageNum, lastRecordIndex, criteriaObj);
            }
            return criteriaObj;
        }

        $scope.Initialize = function(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
                console.log("2 Pageview - Initialize()");

            $scope.InitScope();
            if(typeof $scope.EventListener == "function"){
                $scope.EventListener($scope, $element, $attrs, $ctrl);
            }else{
                EventListener();
            }
            TryToCallInitDirective();
        }
        $scope.InitScope = function(){
            InitializePageView();
        }
        $scope.DefaultInitDirective = function(){
            var getTbStructurePromiseResult = GetTableStructure();

            getTbStructurePromiseResult.then(function(){
                $scope.GotoFirstPageRecord();
            });
        }

        $scope.PointedToRecord = function(pRecord, event, rowScope){
            $scope.pointedRecord = pRecord;

            // remove all background color
            angular.element(event.currentTarget).parent().find("tr").removeClass("active");

            // change the background color
            angular.element(event.currentTarget).addClass("active");

            if(typeof $scope.CustomPointedToRecord == "function"){
                $scope.CustomPointedToRecord(pRecord, rowScope, $scope, $element, $ctrl);
            }else{
                Core.SysLog.Print("CustomPointedToRecordNotFound", $scope.programId, $element[0].tagName, "CustomPointedToRecordNotFound");
            }
        }

        $scope.SelectedToRecord = function(sRecord, event, rowScope){
            $scope.selectedRecord = jQuery.extend({}, $scope.pointedRecord);
            if(
                    (
                        typeof($scope.pointedRecord) == "undefined" || $.isEmptyObject($scope.pointedRecord)
                    )
                    && 
                    (
                        typeof(sRecord) == "undefined" || $.isEmptyObject(sRecord)
                    )
                ){
                    $scope.DisplayMessage = "Please select a record"
                    return;
            }
            var sRecord = $scope.selectedRecord;

            $scope.pointedRecord = {};

            // check parent scope, is editbox
            var isParentScopeFromEditbox = false;
            if(typeof ($scope.$parent.SetEditboxNgModel) == "function")
                isParentScopeFromEditbox = true;

            if(isParentScopeFromEditbox){
                $scope.$parent.SetEditboxNgModel(sRecord);
            }

            if(typeof $scope.CustomSelectedToRecord == "function"){
                $scope.CustomSelectedToRecord(sRecord, rowScope, $scope, $element, $ctrl);
            }else{
                Core.SysLog.Print("CustomSelectedToRecordNotFound", $scope.programId, $element[0].tagName, "CustomSelectedToRecordNotFound");
            }

            if(typeof $scope.ClosePageView == "function")
                $scope.ClosePageView();
        }

        $scope.ClearSelectedRecord = function(){
            $scope.selectedRecord = {};
            $scope.$parent.SetEditboxNgModel({});
        }

        $scope.ClearNRefreshData = function(){
            var pageNum = $scope.pageNum;

            $scope.DisplayMessage = "";
            // $scope.dataSource = [];
            // $scope.sortedDataSource = [];
            $scope.currentPageRecords = {};
            $ctrl.ngModel = {};
            // $scope.maxRecordsCount = -1;
            $scope.getNextPageTimes = 0;

            $scope.TryToDisplayPageNum(pageNum, true);

            // if the current page record is not exists (may be just deleted)
            // it should call GotoPreviousPageRecord() to display the previous page
        }
        $scope.LockAllControls = function(){
            LockAllControls();
        }
        $scope.UnLockAllControls = function(){
            $timeout(function(){
                UnLockAllControls();
                }, 1000); // (milliseconds),  1s = 1000ms
        }

        $scope.GotoFirstPageRecord = function(){
            var pageNum = 1;
            $scope.TryToDisplayPageNum(pageNum);
        }
        $scope.GotoPreviousPageRecord = function(){
            if($scope.pageNum > 1){
                var pageNum = $scope.pageNum;
                pageNum-=1;
                $scope.TryToDisplayPageNum(pageNum);
            }else{
                // first of the page, cannot Goto Previous
                Core.SysLog.Print("BeginningOfThePageCannotGotoPrevious", $scope.programId, $element[0].tagName, "BeginningOfThePageCannotGotoPrevious");
            }
        }
        $scope.GotoNextPageRecord = function(){
            var pageNum = $scope.pageNum;
            pageNum+=1;
            if(pageNum > $scope.lastPageNum && $scope.lastPageNum!=-1){
                $scope.ReachLastPage();
                return;
            }

            $scope.TryToDisplayPageNum(pageNum);
        }
        $scope.ZeroRecordCount = function(){
            $scope.DisplayMessage = "Record Not Found.";
        }
        $scope.ReachLastPage = function(){
            $scope.DisplayMessage = "End of records.";
        }
        $scope.GotoLastPageRecord = function(){
            if($scope.pageNum == $scope.lastPageNum)
                return;
            if($scope.lastPageNum == -1){
                return;
            }
            if($scope.lastPageNum != -1){
                // $scope.pageNum = $scope.lastPageNum;
                $scope.pageNum++;
                $scope.TryToDisplayPageNum($scope.pageNum);
                return;
            }

            $scope.pageNum++;
            var pageNum = $scope.pageNum;

            while($scope.lastPageNum == -1)
            $scope.TryToDisplayPageNum(pageNum);
        }

        // Check is sortedDataSource contains enough records
        // showPageNumX = 2, numOfRecordPerPage = 10, record start from 11 to 20
        function IsEnoughSortedRecord(showPageNumX){
            var isAllRecordsExists = true;

            var numOfRecordPerPage = $scope.numOfRecordPerPage;
            var recordNumberStart = (showPageNumX - 1) * numOfRecordPerPage;
            var recordNumberEnd = showPageNumX * numOfRecordPerPage - 1;

            for(var recordCounter = recordNumberStart; recordCounter < recordNumberEnd; recordCounter++){
                if(typeof($scope.sortedDataSource[recordCounter]) == "undefined"){
                    isAllRecordsExists = false;
                    break;
                }
            }

            return isAllRecordsExists;
        }

        $scope.TryToDisplayPageNum = function(pageNum, clearNRefresh){
            $scope.DisplayMessage = "";
            if(typeof(clearNRefresh) == "undefined"){
                clearNRefresh = false;
            }
            var isAllRecordsExists = IsEnoughSortedRecord(pageNum);
            if(clearNRefresh){
                isAllRecordsExists = false;
            }

            var displayPromise = $q(function(resolve, reject){

                if($scope.maxRecordsCount != $scope.dataSource.length || clearNRefresh){
                    // Get data if records not enough
                    if(!isAllRecordsExists){
                        var getNextPromise = $scope.GetNextPageRecords(pageNum);
                        resolve(getNextPromise);
                    }
                }
                reject("Record exists in data source, display without GetData");
            });

            displayPromise.then(function(solvedPromise){
                // resolved get data
                DisplayPageNum(pageNum);
            }, function(rejectedPromise){
                // rejected get data, since records already exists
                DisplayPageNum(pageNum);
            }).then(function(){
                $scope.pageNum = pageNum
            })

        }

        function DisplayPageNum(pageNum){
            Core.SysLog.Print("DisplayPageNum", $scope.programId, pageNum, $element[0].tagName, "DisplayPageNum");
            var numOfRecordPerPage = $scope.numOfRecordPerPage;

            var recordNumberStart = (pageNum - 1) * numOfRecordPerPage;
            var recordNumberEnd = pageNum * numOfRecordPerPage - 1;

            var currentPageRecords = [];
            $scope.currentPageRecords = [];
            $ctrl.ngModel = [];
            if(typeof($scope.sortedDataSource[recordNumberStart]) == "undefined"){

            }else{
                // assign records to current page according to the page number
                var currentPageRecords = [];
                for(var recordCounter = recordNumberStart; recordCounter <=recordNumberEnd; recordCounter++){

                    if(recordCounter >= $scope.maxRecordsCount && $scope.maxRecordsCount > 0)
                        break;
                    var newRow = jQuery.extend({}, $scope.sortedDataSource[recordCounter]);
                    if(!jQuery.isEmptyObject(newRow))
                        currentPageRecords[currentPageRecords.length] = newRow;
                }
            }
            $scope.currentPageRecords = jQuery.extend( {}, currentPageRecords );
            $ctrl.ngModel = jQuery.extend( {}, currentPageRecords );
            // $ctrl.ngModel = $scope.currentPageRecords = currentPageRecords;
        }

        $scope.GetNextPageRecords = function(pageNum){
            $scope.LockAllControls();

            var clientID = Security.GetSessionID();
            var programId = $scope.programId.toLowerCase();
            var numOfRecordPerPage = $scope.numOfRecordPerPage;
            var recordOffset = (pageNum-1) * $scope.numOfRecordPerPage;

            var submitData = {
                "Table": programId,
                "PageNum": pageNum,
                "PageRecordsLimit": numOfRecordPerPage,
                "Offset": recordOffset
            };

            var request = DataAdapter.GetData(submitData); 
            var httpResponseObj = {};
            $scope.getNextPageTimes+=1;
            request.then(function(responseObj) {
                httpResponseObj = responseObj;
                $scope.UnLockAllControls();

                // Object.keys Browser compatibility
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
                var recordCount = Object.keys(responseObj.data).length;
                $scope.tableStructure = responseObj.TableSchema;
                if(recordCount > 0){
                    AppendToDataSource(pageNum, responseObj.data);
                    SortingTheDataSource();
                }

                // 20170312, keithpoon, fixed: end page problem caused when the record counts is the multiple of 10
                if(!responseObj.data || (recordCount < $rootScope.serEnv.phpRecordLimit && $scope.getNextPageTimes > 1) || recordCount == 0){
                    $scope.maxRecordsCount = $scope.sortedDataSource.length;
                    if($scope.getNextPageTimes == 1){
                        $scope.ZeroRecordCount();
                    }else{
                        $scope.ReachLastPage();
                    }
                }

                if(recordCount < $rootScope.serEnv.phpRecordLimit){
                    $scope.maxRecordsCount = $scope.sortedDataSource.length;
                }

                if(responseObj.TotalRecordCount){
                    if(responseObj.TotalRecordCount > -1){
                        $scope.maxRecordsCount = responseObj.TotalRecordCount;
                    }
                }
            }, function(reason) {
              // console.error("Fail in GetNextPageRecords() - "+tagName + ":"+$scope.programId)
            }).finally(function() {
                // Always execute this on both error and success
                if(typeof $scope.CustomGetDataResult == "function"){
                    $scope.CustomGetDataResult(httpResponseObj.data,
                        httpResponseObj.HTTP.statusCode,
                        $scope,
                        $element,
                        $attrs,
                        $ctrl);
                }else{
                     CustomGetDataResult(httpResponseObj,
                        httpResponseObj.HTTP.statusCode);
                }

            })

            return request;
        }

        // 20180209, keithpoon, sometime unable to tigger the watch listener
        // $watch not firing on data change
        $scope.$watch(
          function() { return $scope.maxRecordsCount; },
          function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
                TriggerMaxRecordCountChanged(newValue, oldValue)
            }
          },
          true
        );

        function TriggerMaxRecordCountChanged(newValue){
            if(newValue > 0)
            {
                $scope.lastPageNum = parseInt($scope.maxRecordsCount/$scope.numOfRecordPerPage)
                if( $scope.maxRecordsCount % $scope.numOfRecordPerPage > 0)
                    $scope.lastPageNum++;
            }else{
                $scope.lastPageNum = -1
            }
        }

        $scope.Initialize();
    }

    function templateUrlFunction(tElement, tAttrs) {
        if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("0 Pageview - templateUrlFunction()");
        var directiveName = tElement[0].tagName;

        directiveName = directiveName.toLowerCase();
        var templateURL = ThemeService.GetTemplateURL(directiveName);
        return templateURL;
    }
    function templateFunction(tElement, tAttrs) {
        var template = '' +
            '<div class="panel panel-default" style="margin: 0px; padding: 0px;">' +
            '<div class="panel-body">' +
                // list win top bar
                // '<div class="row">' +
                //  // search box
                //  '<div class="col-sm-offset-2 col-sm-8 col-xs-12">' +
                //      '<form class="pageview-search">' +
                //          '<div class="input-group">' +
                //            '<input type="text" class="form-control" placeholder="Search for...">' +
                //            '<span class="input-group-btn">' +
                //              '<button class="btn btn-default" type="button">Go!</button>' +
                //            '</span>' +
                //          '</div>' +
                //      '</form>' +
                //  '</div>'+
                // '</div>' +
                // inside of the ng-transclude
                //'<div ng-transclude></div>' +
                '<div class="custom-transclude"></div>' +
            '</div>' +
            '<div class="panel-footer">' +
                // button toolbar
                '<div class="btn-toolbar" role="toolbar" aria-label="Pageview with button groups">' +
                    // refresh button
                    '<div class="btn-group" role="group">' +
                        '<button type="button" class="btn btn-default" ng-click="ClearNRefreshData()" aria-label="Reconnect and Refresh the data">' +
                          '<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> <span class="hidden-xs">Refresh</span>' +
                        '</button>' +
                    '</div>' +
                    // arrow button
                    '<div class="btn-group" role="group">' +
                        '<button type="button" class="btn btn-default" ng-click="GotoFirstPageRecord()" aria-label="Go to the first record">' +
                          '<span class="glyphicon glyphicon-step-backward" aria-hidden="true"></span>' +
                        '</button>' +
                        '<button type="button" class="btn btn-default" ng-click="GotoPreviousPageRecord()" aria-label="Previous record">' +
                          '<span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span>' +
                        '</button>' +
                        '<button type="button" class="btn btn-default" ng-click="GotoNextPageRecord()" aria-label="Next record">' +
                          '<span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>' +
                        '</button>' +
                        '<button type="button" class="btn btn-default" ng-click="GotoLastPageRecord()" aria-label="Go to the last record">' +
                          '<span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span>' +
                        '</button>' +
                    '</div>' +
                    // tick / select button

                    '<div class="btn-group" role="group" aria-label="..." data-confrim-btn-group="false">' +
                        '<button type="button" class="btn btn-primary" ng-click="SelectedToRecord()" aria-label="Select the pointed record">' +
                          '<span class="fa fa-check" aria-hidden="true"></span> <span class="hidden-xs">Select</span>' +
                        '</button>' +
                        '<button type="button" class="btn btn-default" ng-click="ClosePageView()" aria-label="Exit the record selection">' +
                          '<span class="fa fa-undo" aria-hidden="true"></span> <span class="hidden-xs">Back</span>' +
                        '</button>'+
                    '</div>' +
                    // clear button
                    // '<div class="btn-group" role="group" aria-label="...">' +
                    //     '<button type="button" class="btn btn-default" ng-click="ClearSelectedRecord()" aria-label="Reset the form">' +
                    //       '<span class="fa fa-eraser" aria-hidden="true"></span> <span class="hidden-xs">Clear</span>' +
                    //     '</button>' +
                    // '</div>' +
                '</div>' +
                '<div ng-bind="DisplayMessage"></div>' +
            '</div>' +
            '</div>' +
            '';
        return template;
    }
    
    return {
        require: ['ngModel'],
        restrict: 'EA', //'EA', //Default in 1.3+
        transclude: true,

        // scope: [false | true | {...}]
        // false = use parent scope
        // true =  A new child scope that prototypically inherits from its parent
        // {} = create a isolate scope
        scope: true,

        controller: PageViewConstructor,
        controllerAs: 'pageviewCtrl',

        //If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
        bindToController: {
            ngModel: '=',
            numOfRecordPerPage: '=pageRecordsLimit',
        },
        // bisndToController: true,
        template: templateFunction,
        //templateUrl: templateUrlFunction,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    if(Core.GetConfig().debugLog.DirectiveFlow)
                        console.log("3 Pageview - compile preLink()");
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                    if(Core.GetConfig().debugLog.DirectiveFlow)
                        console.log("4 Pageview - compile postLink()");

                    // org
                    transclude(scope, function(element, scope) {
                        iElement.find('.custom-transclude').append(element);
                        // iElement.find('div[data-confrim-btn-group]').hide();
                    });
                    
                    // if parent is a editbox, hide pageview
                    var isParentScopeFromEditbox = false;
                    if(typeof (scope.$parent.SetEditboxNgModel) == "function")
                        isParentScopeFromEditbox = true;

                    if(isParentScopeFromEditbox)
                        angular.element(iElement).hide();
                }
            }
        },
    };
}]);
