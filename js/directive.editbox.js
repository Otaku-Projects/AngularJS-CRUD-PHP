/**
 * <editbox> auto generate a invisible <pageview> element, Popup a modal and the pageview when the user click the edit button
 * <editbox
    ng-model=""
    program-id=""
    >
 * @param {Object} ng-model - store the user selected record from the pageview, to display the record details on the UI.
 * @param {String} program-id - the pageview will display the records regarding to this program id
 */
app.directive('editbox', ['Core', 'Security', '$rootScope', '$compile', 'ThemeService', 'config', function(Core, Security, $rootScope, $compile, ThemeService, config) {
    function EditboxConstructor($scope, $element, $attrs) {
        console.log("1 Edotbox - EditboxConstructor()");
        var constructor = this;
        var $ctrl = $scope.editboxCtrl;

    	function InitializeEditBox() {
            $scope.editboxDataList = [];
            if(typeof($ctrl.ngModel) == "undefined" || $ctrl.ngModel == null)
                $ctrl.ngModel = {};

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
            else
            	alert("<editbox> Must declare a attribute of program-id");

		    // check attribute screenId
            var isScreenIdFound = false;
            if(typeof($attrs.screenId) != undefined){
            	if($attrs.screenId != null && $attrs.screenId !=""){
            		isScreenIdFound = true;
            	}
            }
            if(isScreenIdFound){
            	$scope.screenId = $attrs.screenId;
            }else{
                $scope.screenId = "";
                if(typeof($scope.programId) != "undefined")
                    $scope.screenId = $scope.programId;
            }

            var isInRange = IsParentInRange();
            if(isInRange){
                var isRangeProperty = false;
                if(typeof($attrs.range) != undefined){
                    if($attrs.range != null && $attrs.range !=""){
                        isRangeProperty = true;
                    }
                }
                if(isRangeProperty){
                    $scope.range = $attrs.range;
                }
                else{
                    console.warn("<editbox> Should declare a attribute of range, since it is under <range>");
                }

                var isRangeValuePropery = false;
                if(typeof($attrs.rangeValue) != undefined){
                    if($attrs.rangeValue != null){
                        isRangeValuePropery = true;
                    }
                }
                if(isRangeValuePropery){
                    // cannot assign ALL to $attrs.rangeValue, it will break the binding between $attrs.rangeValue <--> expression
                    // the ALL should assign in the range directive
                    $attrs.$observe('rangeValue', function(interpolatedValue){
                        $scope.rangeValue = interpolatedValue;
                        if(typeof ($scope.$parent.SetRange) == "function"){
                            $scope.$parent.SetRange($scope.range, interpolatedValue)
                        }
                    })
                }
                else{
                    console.warn("<editbox> Should declare a attribute of rangeValue, since it is under <range>");
                }
            }
    	}

        function IsParentInRange(){

            var isParentScopeFromRange = false;
            if(typeof ($scope.$parent.IsRange) == "function"){
                isParentScopeFromRange = true;
                isParentScopeFromRange = $scope.$parent.IsRange();
            }

            return isParentScopeFromRange;
        }

        function TryToCallInitDirective(){
            $ctrl.programId = $scope.programId;
            // $ctrl.screenId = $scope.screenId;

            if(typeof $scope.InitDirective == "function"){
                $scope.InitDirective($scope, $element, $attrs, $ctrl);
            }else{
                $scope.DefaultInitDirective();
            }
        }

        $scope.DefaultInitDirective = function(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("scope.$id:"+$scope.$id+", may implement $scope.InitDirective() function in webapge");
        }
        function EventListener(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("$scope.$id:"+$scope.$id+", must implement $scope.EventListener() function in webapge");
        }
    	function PopupModal(){
            var modal = $element.find(".pageview-modal");
            var themeCode = config.uiTheme.toUpperCase();
            var themeName;
            switch(themeCode){
                case "D":
                    themeName = "default";
                    break;
                case "B":
                    themeName = "bootstrap";
                    modal.addClass("fade in");
                    break;
                case "U":
                    themeName = "uikit";
                    modal.addClass("uk-modal uk-open");
                    break;
                case "W":
                    themeName = "w3css";
                    break;
                case "M":
                    themeName = "material_ng";
                    break;
                case "J":
                    themeName = "jqueryui";
                    break;
                case "S":
                    themeName = "semantic";
                    break;
                default:
                    themeName = "default";
                    break;
            }
            modal.show();

    		modal.click(function( event ) {
			  $scope.ClosePageView();
			});

    	}

        $scope.Initialize = function(){
            console.log("2 Edotbox - Initialize()");
            InitializeEditBox();
        }


    	$scope.PopupPageview = function(){
            var modalContainer = angular.element($element).find(".pageview-modal");
            var pageview = angular.element($element).find("pageview");

            // hide the body scroll bar when showing modal dialog
            $("body").css("overflow", "hidden");

            // var winHeight = jQuery(window).height();
            // var winWidth = jQuery(window).width();

            // var pageviewHeight = pageview.height();
            // var pageviewWidth = pageview.width();
            // var scrollTop = jQuery(window).scrollTop();
            // var scrollLeft = jQuery(window).scrollLeft();

            // var modalContainerHeight = modalContainer.height();
            // var modalContainerWidth = modalContainer.width();

            // console.log(winHeight);
            // console.log(winWidth);
            // console.log(pageviewHeight);
            // console.log(pageviewWidth);
            // console.log(scrollTop);
            // console.log(scrollLeft);

            // popup at center of the screen
            pageview.css("top", ( jQuery(window).height() - pageview.height() ) / 2 + "px");
            // should not specify the width in number, otherwise break the RWD
            //pageview.css("left", ( jQuery(window).width() - pageview.width() ) / 2 + "px");

    		pageview.show();
    	}

    	$scope.OpenPageView = function(){
    		PopupModal();
    		$scope.PopupPageview();
    	}

    	$scope.ClosePageView = function(){
            $("body").css("overflow", "scroll");

            var pageviewModal = $element.find(".pageview-modal");
            pageviewModal.hide();

            var pageview = $element.find("pageview");
            pageview.hide();
    	}

        // function call from pageview, set editbox ngModel by selected record from pageview
        $scope.SetEditboxNgModel = function(selectedRecord){
            $ctrl.ngModel = selectedRecord;
        }
        $scope.ClearEditboxNgModel = function(editboxNgModel){
            $ctrl.ngModel = {};
        }

        //process flow
        $scope.Initialize();
        if(typeof $scope.EventListener == "function"){
            $scope.EventListener($scope, $element, $attrs, $ctrl);
        }else{
            EventListener();
        }
        TryToCallInitDirective();
    }
    function templateFunctionOLD(tElement, tAttrs, ThemeService) {
        var directiveName = tElement[0].tagName;
        directiveName = directiveName.toLowerCase();

        var templateUrl = ThemeService.GetTemplateURL(directiveName);
        return templateUrl;
    }
    function templateUrlFunction(tElement, tAttrs) {
        console.log("0 Edotbox - templateUrlFunction()");
        var directiveName = tElement[0].tagName;

        directiveName = directiveName.toLowerCase();
        var templateURL = ThemeService.GetTemplateURL(directiveName);
        return templateURL;
    }
    function templateFunction(tElement, tAttrs) {
        var directiveName = tElement[0].tagName;

        directiveName = directiveName.toLowerCase();
        var tempate = "<div class='custom-transclude'></div>";

        return tempate;
    }

	return {
		require: ['?range', 'ngModel'],
		restrict: 'EA', //'EA', //Default in 1.3+
        transclude: true,

		// scope: [false | true | {...}]
		// false = use parent scope
		// true =  A new child scope that prototypically inherits from its parent
		// {} = create a isolate scope
		scope: true,

		controller: EditboxConstructor,
		controllerAs: 'editboxCtrl',

		//If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
		 bindToController: {
		 	ngModel: '=',
			programId: '=',
			screenId: '=',
            SelectedToRecord: '='
		 },
       //templateUrl: templateUrlFunction,
		template: templateFunction,
		compile: function compile(tElement, tAttrs, transclude) {
		    return {
		        pre: function preLink(scope, iElement, iAttrs, controller) {
                    console.log("3 Edotbox - compile preLink()");
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
                    console.log("4 Edotbox - compile postLink()");


                    transclude(scope, function(clone, scope) {
                        var programId = scope.programId;
                        var screenId = scope.screenId;
                        var pageviewTemplate = ''+
                        '<div class="modal pageview-modal">' +
                        '</div>' +
                        '<pageview class="pageview-popup-list-win" ng-model="editboxDataList" program-id="'+programId+'">'+
                                '<screen program-id="'+screenId+'"></screen>' +
                        '</pageview>';

                        var linkFn = $compile(pageviewTemplate);
                        var pageviewElement = linkFn(scope, function(e_pageview, s_pageview){
                        });

                        iElement.find('.custom-transclude').append(clone);
                        iElement.find('.custom-transclude').append(pageviewElement);  
                        iElement.find('div[data-confrim-btn-group]').show();

                    });

                    scope.ClosePageView();
		        }
		    }
		},
	};
}]);