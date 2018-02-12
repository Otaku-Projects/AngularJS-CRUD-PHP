
    var moreApp = angular.module("moreBtn", []);
	
	moreApp.directive("clickMoreShow", function($rootScope, $log){
		return {
			restrict:'A',
			link:function($scope, element, attrs){
				element.hide();

				$scope.$watch(
					function () {return $scope.showMore},
					function (newVal, oldVal){
						if(newVal){
							element.show();
							element.addClass("animated");
							element.addClass($scope.moreIn);
						}
					}
				)

			}
		}
	});
	
  moreApp.directive("more", function($rootScope, $log) {
	return {
		restrict: 'E',
		replace: true,
		//controler: function (scope, $element, $attrs, $transclde){
		//},
		//template: '<button type="button" class="animated lightSpeedIn btn-link" ng-click="showControl()" ng-show="showBtn" ng-class="{{showBtnNgClass}}">...more</button>',
		template: '<button type="button" class="btn-link" ng-show="showBtn" ng-click="showControl()" >...more</button>',
		
		link: function ($scope, element, attrs) {
			//$log.log("here is more btn")
			$scope.showBtn = true;
			$scope.showMore = false;
			// default In/Out animation
			$scope.defaultBtnIn = "lightSpeedIn";
			$scope.defaultBtnOut = "lightSpeedOut";
			$scope.defaultMoreIn = "lightSpeedIn";
			$scope.defaultMoreOut = "lightSpeedOut";
			// store the custom animation
			$scope.btnIn = "";
			$scope.btnOut = "";
			$scope.moreIn = "";
			$scope.moreOut = "";
			// assign the animation which in used
			$scope.btnIn = (attrs.btnIn) ? attrs.btnIn : $scope.defaultBtnIn;
			$scope.btnOut = (attrs.btnOut) ? attrs.btnOut : $scope.defaultBtnOut;
			$scope.moreIn = (attrs.moreIn) ? attrs.moreIn : $scope.defaultMoreIn;
			$scope.moreOut = (attrs.moreOut) ? attrs.moreOut : $scope.defaultMoreOut;

			element.addClass("animated")
			element.addClass($scope.btnIn)

			$scope.showControl = function(){
            	$log.log("more btn clicked.")
            	$scope.showMore = true;
            	$scope.showBtn = false;
            	$scope.showMore = true;
            	$scope.showBtn = false;
                element.removeClass($scope.btnIn);
                element.addClass($scope.btnOut);
			}
        }
        
	}
});