angular.module('carpoolingVan')

.controller("ridesCtrl", function($scope, ridesService, routesService, $ionicModal) {
  $scope.routes = routesService.routes;
  $scope.showPassengers = showPassengers;
  $scope.startRide = startRide;

  function showPassengers(route) {
    $scope.route = route;
    $scope.passengers = routesService.passengers(route);

    $ionicModal.fromTemplateUrl('templates/routePassengersModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.openModal();
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.passengers
    };
  }

  function startRide(route) {
    rideExists(route)
    .then(function(exists) {
      if(!exists) {
        ridesService.start(route);
        alert("OK! Let's drive");
      }
      else {
        alert("Already exists");
      }
    });
  }

  function rideExists(route) {
    return ridesService.checkIfExists(route)
    .then(function(exists) {
      return exists;
    });
  }
});
