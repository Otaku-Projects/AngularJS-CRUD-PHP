
app.directive('message', ['$rootScope',
    '$timeout',
    'Security',
    'MessageService',
    'ThemeService',
    'Core', function($rootScope, $timeout, Security, MessageService, ThemeService, Core) {
    function MessageConstructor($scope, $element, $attrs) {
        var constructor = this;
        var $ctrl = $scope.msgCtrl;
        var tagName = $element[0].tagName.toLowerCase();

        $scope.autoClose = false;
        var DirectiveProperties = (function () {
            var autoClose;

            function findAutoClose(){
                var object = $attrs.autoClose;
                if(typeof(object) != "undefined")
                    return true;
                else
                    return false;
            }

            return {
                getAutoClose: function () {
                    if (!autoClose) {
                        autoClose = findAutoClose();
                    }
                    $scope.autoClose = autoClose;
                    return autoClose;
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
        function InitializeMessage() {
            DirectiveProperties.getAutoClose();

            $ctrl.ngModel = [];
            
            $ctrl.ngModel = MessageService.getMsg();
            $scope.ngModel = $ctrl.ngModel;
        }
        $scope.Test = function(){
            console.dir($ctrl)
            console.dir($ctrl.ngModel)
        }
        $scope.Initialize = function(){
            $scope.InitScope();
            TryToCallInitDirective();
        }
        $scope.InitScope = function(){
            InitializeMessage();
        }

        function InitDirective(){
            if(Core.GetConfig().debugLog.DirectiveFlow)
            console.log("scope.$id:"+$scope.$id+", may implement $scope.InitDirective() function in webapge");
        }
//        $scope.Initialize();

        $scope.$watchCollection(
          function() { return $ctrl.ngModel },
          function(newValue, oldValue) {
             if(typeof(newValue) == "undefined" && typeof(oldValue) == "undefined")
                return;

              var newValueLength = newValue.length;
              var oldValueLength = oldValue.length;
              
            if ( newValueLength !== oldValueLength ) {
//                if(newValueLength > oldValueLength){
                    if($scope.autoClose)
                        $timeout(function(){
                            MessageService.shiftMsg();
                        }, 7000); // (milliseconds),  1s = 1000ms
//                }
            }
          }
        );
    }
    function templateFunction(tElement, tAttrs) {
        console.log("Message - templateFunction()");
        var globalCriteria = $rootScope.globalCriteria;

        var template = '' +
          '<div class="custom-transclude"></div>';
        template = '<div class="" ng-if="msgCtrl.ngModel.length > 0"><div ng-repeat="dspMsg in msgCtrl.ngModel track by $index" ng-bind="dspMsg"></div></div>';
        return template;
    }
    function templateUrlFunction(tElement, tAttrs) {
        var directiveName = tElement[0].tagName;

        directiveName = directiveName.toLowerCase();
        var templateURL = ThemeService.GetTemplateURL(directiveName);
        return templateURL;
    }

    return {
        require: ['ngModel'],
        restrict: 'E', //'EA', //Default in 1.3+
        transclude: true,
        scope: true,

        controller: MessageConstructor,
        controllerAs: 'msgCtrl',

        //If both bindToController and scope are defined and have object hashes, bindToController overrides scope.
        bindToController: {
            ngModel: '=',
        },
//        template: templateFunction,
        templateUrl: templateUrlFunction,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
//                    console.log("Message - compile preLink()");
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
//                    console.log("Message - compile postLink()");

                    transclude(scope, function (clone, scope) {
                        iElement.find('.custom-transclude').append(clone);
                    })

                    scope.Initialize();
                }
            }
        },
    };
}]);
