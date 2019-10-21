"use strict";
  app.controller('specServerArchitectureController', ['$scope', '$rootScope', 'Lightbox', function ($scope, $rootScope, Lightbox) {
    $scope.images = [
        {
          'url': 'images/System%20Architecture%20-%20System%20Block%20Diagram.png',
          // 'caption': 'Optional caption',
          'thumbUrl': 'images/System%20Architecture%20-%20System%20Block%20Diagram.png'
        }
    ];

    $scope.openLightboxModal = function (index) {
        Lightbox.openModal($scope.images, index);
    };
  }]);