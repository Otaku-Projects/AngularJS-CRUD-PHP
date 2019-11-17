
app.directive('range', ['$rootScope',
    '$timeout',
    'Core',
    'Security',
    'MessageService', function($rootScope, $timeout, Core, Security, MessageService) {
    function RangeConstructor($scope, $element, $attrs) {
		if(Core.GetConfig().debugLog.DirectiveFlow)
			console.log("1 Range - RangeConstructor()");
        var constructor = this;
        var $ctrl = $scope.rangeCtrl;
        var tagName = $element[0].tagName.toLowerCase();

        var DirectiveProperties = (function () {
            var multi;

            function findMultiable(){
                var object = $attrs.multi;
                if(typeof(object) != "undefined")
                    return true;
                else
                    return false;
            }

            return {
                getMultiable: function () {
                    if (!multi) {
                        multi = findMultiable();
                    }
                    $scope.multi = multi;
                    return multi;
                }
            };
        })();

        function TryToCallInitDirective(){
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

		// this getter only for editbox
        $scope.IsRange = function()
        {
            return true;
        }

        $scope.GetInitRange = function(){
            var range = {start: "ALL", end: ""};

            return range;
        }

        function InitializeRange() {
            DirectiveProperties.getMultiable();
            var range = {start: "ALL", end: "", isAll: true};
            $ctrl.ngModel = jQuery.extend(true, {}, range);
			
			$scope.isStartBound = false;
			$scope.isEndBound = false;
			$scope.isActivatedByEditbox = false;
        }
        $scope.Initialize = function(){
            $scope.InitScope();
            if(typeof $scope.EventListener == "function"){
                $scope.EventListener($scope, $element, $attrs, $ctrl);
            }else{
                EventListener();
            }
            TryToCallInitDirective();
        }
        $scope.InitScope = function(){
            InitializeRange();
        }

        function InitDirective(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("scope.$id:"+$scope.$id+", may implement $scope.InitDirective() function in webapge");
        }
        function EventListener(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("scope.$id:"+$scope.$id+", may implement $scope.EventListener() function in webapge");
        }

        // chagneRagne = [start | end]
        function RangeStringChange(changeRange, ctrlModel){
            var isLocaleCompareSupport = localeCompareSupportsLocales();

            var strStart = ctrlModel.start;
            var strEnd = ctrlModel.end;
            var stringDifference = 0;

            // if user change the start value
            if(strStart != "ALL"){
                $ctrl.ngModel.isAll = false;
            }

            // string comparison, find the strStart position of strEnd
            if(isLocaleCompareSupport){
                 stringDifference = strStart.localeCompare(strEnd);
            }else{
                if(strStart < strEnd)
                    stringDifference = -1;
                if(strEnd < strStart)
                    stringDifference = 1;
                if(strStart == strEnd)
                    stringDifference = 0;
            }

            if(changeRange == "start"){

                if(stringDifference > 0)
                {
                    strEnd = strStart
                }
                if(stringDifference < 0)
                {

                }
            }else if(changeRange == "end"){
                if(stringDifference > 0)
                {
                    strStart = strEnd
                }
                if(stringDifference < 0)
                {
                    if(strStart == "")
                        strStart = strEnd
                }
            }

            ctrlModel.start = strStart;
            ctrlModel.end = strEnd;
        }

        function localeCompareSupportsLocales() {
          try {
            'foo'.localeCompare('bar', 'i');
          } catch (e) {
            return e.name === 'RangeError';
          }
          return false;
        }
		
		$scope.ToggleRangeInAll = function(){
			$scope.SetInAllRange($ctrl.ngModel.isAll);
		}
		
		$scope.SetStartOrEndBound = function(setRange){
            if(setRange == "start"){
				$scope.isStartBound = true;
			}else if(setRange == "end"){
				$scope.isEndBound = true;
			}
		}
		
		$scope.GetIsStartEndBound = function(){
			return $scope.GetIsStartBound() && $scope.GetIsEndBound();
		}
		
		$scope.GetIsStartBound = function(){
			return $scope.isStartBound;
		}
		
		$scope.GetIsEndBound = function(){
			return $scope.isEndBound;
		}
		
		$scope.GetIsActivate = function(){
			return $scope.isActivatedByEditbox;
		}
		
		$scope.SetIsActivate = function(){
			$scope.isActivatedByEditbox = true;
		}
		
		$scope.SetInAllRange = function(isCheckAll){
			$ctrl.ngModel.isAll = isCheckAll;
		}
		
		// this setter only for editbox
        $scope.SetRange = function(rangeType, value){
            console.dir("rangeType:"+rangeType)
            console.dir("value:"+value)
            if(rangeType == "start"){
                $ctrl.ngModel.start = value;
            }else if(rangeType == "end"){
                $ctrl.ngModel.end = value;
            }
            RangeStringChange(rangeType, $ctrl.ngModel)
        }

        $scope.GetRange = function(){
            var rangeList = [];
            var range = rangeList[0] = {start: "", end: ""};

            range.start = $ctrl.ngModel.start;
            range.end = $ctrl.ngModel.end;

            return range;
        }
        $scope.IsLockEndControl = function(){
            var isLock = false;
            var range = $scope.GetRange();
            if(range.start == "ALL"){
                isLock = true;
            }
            return isLock;
        }

        $scope.CheckAllRange = function(test){
            console.dir("CheckAllRange() function")
        }
        
        $scope.$watch(
          function() { return $ctrl.ngModel.isAll; },
          function(newValue, oldValue) {
              var isCheckAll = newValue;
			  console.trace()
              console.dir($ctrl.ngModel)
              console.dir("newValue:"+newValue)
              console.dir("oldValue:"+oldValue)
            if(isCheckAll){
                $ctrl.ngModel.start = "ALL"
                $ctrl.ngModel.end = ""

                var editBtn = $element.find('button[ng-click="OpenPageView()"]').last();
                editBtn.prop('disabled', true);
            }
            else{
                if($ctrl.ngModel.start == "ALL")
                    $ctrl.ngModel.start = ""

                var editBtn = $element.find('button[ng-click="OpenPageView()"]').last();
                editBtn.prop('disabled', false);
            }
          },
          true
        );
		
		//$scope.Initialize();
    }
    function templateFunction(tElement, tAttrs) {
        var globalCriteria = $rootScope.globalCriteria;

        var template = '' +
          '<div class="custom-transclude"></div>';
        return template;
    }

    return {
        require: ['ngModel'],
        restrict: 'E', //'EA', //Default in 1.3+
        transclude: true,
        scope: true,

        controller: RangeConstructor,
        controllerAs: 'rangeCtrl',

        //If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
        bindToController: {
            ngModel: '=',
        },
        template: templateFunction,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
					if(Core.GetConfig().debugLog.DirectiveFlow)
						console.log("3 Range - compile preLink()");
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
					if(Core.GetConfig().debugLog.DirectiveFlow)
						console.log("4 Range - compile postLink()");

                    transclude(scope, function (clone, scope) {
                        iElement.find('.custom-transclude').append(clone);
                    })
                    
                    scope.Initialize();
                    iElement.ready(function() {
						scope.SetInAllRange(true);
                        scope.rangeCtrl.ngModel.start = "ALL";
                        scope.rangeCtrl.ngModel.isAll = true;
                    })
                }
            }
        },
    };
}]);