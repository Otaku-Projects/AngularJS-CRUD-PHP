"use strict";
  app.controller('specClientArchitectureController', ['$scope', '$rootScope', 'Lightbox', function ($scope, $rootScope, Lightbox) {
      
    $scope.images = [
        {
          'url': 'images/System%20Architecture%20-%20Client%20Architecture.png',
          'thumbUrl': 'images/System%20Architecture%20-%20Client%20Architecture.png'
        }
    ];

    $scope.openLightboxModal = function (index) {
        Lightbox.openModal($scope.images, index);
    };

  }]);