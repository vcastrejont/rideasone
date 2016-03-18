angular.module('carpoolingVan')

.controller("RideCtrl", function($scope) {
  $scope.startTime = "";
  $scope.endTime = "";

  $scope.startRoute = function() {
    $scope.startTime = new Date();
  };

  $scope.finishRoute = function() {
    $scope.endTime = new Date();
  };

  $scope.pickUp = function(passenger) {
    RidesService.pickUp(passenger);
  };
});
