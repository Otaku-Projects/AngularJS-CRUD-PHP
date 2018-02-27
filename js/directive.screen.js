
/**
 * <screen> element to display a share html
 * <screen
    program-id=""
    >
 * @param {String} program-id - optional to define, default as parent scope.programId
 */
app.directive('screen', ['Core', 'Security', '$rootScope', '$timeout', function(Core, Security, $rootScope, $timeout) {
    function ScreenConstructor($scope, $element, $attrs) {
		if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("1 screen - ScreenConstructor()");
        
    	function Initialize() {
            $scope.screenURL = "";
    	}
        
    }
    function templateUrlFunction(tElement, tAttrs) {
    	var templateURL = "";
    	var programId = "";
    	if(typeof(tAttrs.programId) != "undefined"){
    		if(tAttrs.programId != ""){
    			programId = tAttrs.programId;
    		}
    	}

    	templateURL = $rootScope.screenTemplate + programId.toLowerCase() + ".html";

    	return templateURL;
    }
    function templateFunction(tElement, tAttrs){
        var template = "" +
            "<div ng-include='screenURL'></div>";

        return template;
    }

	return {
        require: ['?editbox', '?pageview', '^ngModel'],
		restrict: 'E',
		transclude: true,
		scope: true,

		controller: ScreenConstructor,
		controllerAs: 'screenCtrl',

		// bindToController: {
		// 	ngModel: '=',
		// },
//		templateUrl : templateUrlFunction,
        template: templateFunction,
		compile: function compile(tElement, tAttrs, transclude) {
		    return {
		        pre: function preLink(scope, iElement, iAttrs, controller) {
                    if(Core.GetConfig().debugLog.DirectiveFlow)
                        console.log("2 screen - ScreenConstructor()");
                    
                    transclude(scope, function(clone, scope) {
                        var element = angular.element(iElement);
                        var programId = "";

                        // find the attr programId
                        var isProgramIdFound = false;
                        if(typeof(iAttrs.programId) != undefined){
                            if(iAttrs.programId != null && iAttrs.programId !=""){
                                isProgramIdFound = true;
                            }
                        }
                        // assign parent programId if programId attribute not found
                        if(isProgramIdFound){
                            programId = iAttrs.programId;
                        }
                        else
                            programId = scope.$parent.programId.toLowerCase();

                        scope.screenURL = $rootScope.screenTemplate + programId.toLowerCase() + ".html";
                    });
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
                    if(Core.GetConfig().debugLog.DirectiveFlow)
                        console.log("3 screen - ScreenConstructor()");
		        }
		    }
		},
	};
}]);