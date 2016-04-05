angular.module('carpoolingVan')

.controller("RidesCtrl", function($scope, RidesService) {
  $scope.rides = RidesService.rides;

  $scope.addRoute = function() {
    var time = prompt("Type the time of departure");

    if (time) {
      $scope.routes.$add({
        "time": time
      });
    }
  };

  $scope.addPassenger = function(route) {
    var name = prompt("Type the name of the Nearsoftian");

    if (name) {
      var passengers = RoutesService.passengers(route);

      passengers.$add({
        "name": name
      });
    }

    $ionicListDelegate.closeOptionButtons();
  };

  $scope.getPassengers = function(route) {
    console.log(RoutesService.passengers(route));
  };
});
