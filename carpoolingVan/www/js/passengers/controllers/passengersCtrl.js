angular.module('carpoolingVan')

.controller("PassengersCtrl", function($scope, Passengers) {

  $scope.passengers = Passengers;

  $scope.addPassenger = function() {
    var name = prompt("Type the name of the Nearsoftian");
    if (name) {
      $scope.passengers.$add({
        "name": name
      });
    }
  };
});
