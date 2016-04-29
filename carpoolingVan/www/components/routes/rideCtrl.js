angular.module('carpoolingVan')

.controller("rideCtrl", function($scope, usersService, $stateParams,
  routesService, mapFactory, geolocationSocket, $interval, authFactory) {

  var route = $stateParams.route;
  $scope.user = authFactory.currentUser();
  $scope.pickupUser = pickupUser;

  routesService.getRoute(route.$id).then(function(r) {
    $scope.route = r;

    if($scope.route.passengers) {
      setPassengerInfo();
      initMap();
      geolocationSocket.open($scope.route);
    }
  });

  function pickupUser(userId, flag) {
    routesService.pickupUser(userId, $scope.route, !flag).then(setPassengerInfo,
    function(error) {
      alert(error);
    });
  }

  function setPassengerInfo() {
    angular.forEach($scope.route.passengers, function(p, id) {
      usersService.get(id).then(function(u) {
        $scope.route.passengers[id].info = u;
      });
    });
  }

  function initMap() {
    mapFactory.drawMap().then(function() {
      mapFactory.setMarkers($scope.route.passengers);
    });
  }

  $scope.$watchCollection("route.passengers", function(ol, nu) {
    setPassengerInfo();
  });
});
