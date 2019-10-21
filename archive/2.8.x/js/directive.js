// JavaScript Document
"use strict";

app.directive('logout', ['Security', '$rootScope', function(Security, $rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
            	Security.LogoutNRedirect();
            });
        }
    };
}]);

app.directive('editboxModal', ['Security', '$rootScope', 'ThemeService', function(Security, $rootScope, ThemeService) {
    function EditboxModalConstructor($scope, $element, $attrs) {
        function Initialize() {
            $scope.screenURL = "";
        }
        Initialize();
    }

    function templateUrlFunction(tElement, tAttrs) {
        var directiveName = tElement[0].tagName;

        directiveName = directiveName.toLowerCase();
        directiveName = "editbox-modal"
        var templateURL = ThemeService.GetTemplateURL(directiveName);

        return templateURL;
    }

    return {
        // require: ['^editbox'],
        restrict: 'E',
        // transclude: true,
        scope: true,

        controller: EditboxModalConstructor,
        controllerAs: 'editboxModalCtrl',

        // bindToController: true,
        templateUrl : templateUrlFunction,
        // template: templateFunction,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                }
            }
        },
    };
}]);

app.directive('editboxPageview', ['Security', '$compile', '$rootScope', 'ThemeService', function(Security, $compile, $rootScope, ThemeService) {
    function EditboxPageviewConstructor($scope, $element, $attrs) {
        function Initialize() {
            $scope.screenURL = "";
        }
        Initialize();
    }

    function templateUrlFunction(tElement, tAttrs) {
        var directiveName = tElement[0].tagName;

        directiveName = directiveName.toLowerCase();
        directiveName = "editbox-pageview"
        var templateURL = ThemeService.GetTemplateURL(directiveName);
        // console.log(templateURL)
        return templateURL;
    }

    return {
        // require: ['^editbox'],
        restrict: 'E',
        // transclude: true,
        scope: true,

        controller: EditboxPageviewConstructor,
        controllerAs: 'editboxViewCtrl',

        // bindToController: true,
        templateUrl : templateUrlFunction,
        // template: templateFunction,
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                }
            }
        },
    };
}]);
