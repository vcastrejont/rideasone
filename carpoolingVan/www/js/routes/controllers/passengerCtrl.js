angular.module('carpoolingVan')

.controller("passengerCtrl", function($scope, usersService, $stateParams,
  routesService) {

  $scope.route = $stateParams.route;
  // $scope.passengers = [];
  $scope.role = "driver";
  $scope.pickupUser = pickupUser
/*
  if($scope.route.passengers) {
    angular.forEach($scope.route.passengers, function(p, id) {
      usersService.get(id).then(function(u) {
        $scope.passengers.push(u);
      });
    });
  }
*/
  function pickupUser(userId, flag) {
    routesService.pickupUser(userId, $scope.route, !flag).then(null, function(error) {
      alert(error);
    });
  }
});
