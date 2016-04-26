angular.module('carpoolingVan')

.controller("rideCtrl", function($scope, usersService, $stateParams,
  routesService) {

  var route = $stateParams.route;
  routesService.getRoute(route.$id).then(function(r) {
    $scope.route = r;
    setPassengerInfo();
  });

  $scope.role = $stateParams.role == "driver" ? "driver" : "passenger";
  $scope.pickupUser = pickupUser;
  $scope.bypassUser = bypassUser;

  function pickupUser(userId, flag) {
    routesService.pickupUser(userId, $scope.route, !flag).then(setPassengerInfo,
    function(error) {
      alert(error);
    });
  }

  function bypassUser(userId, flag) {
    routesService.bypassUser(userId, $scope.route, !flag).then(setPassengerInfo,
    function(error) {
      alert(error);
    });
  }

  function setPassengerInfo() {
    if($scope.route.passengers) {
      angular.forEach($scope.route.passengers, function(p, id) {
        usersService.get(id).then(function(u) {
          $scope.route.passengers[id].info = u;
        });
      });
    }
  }
});
