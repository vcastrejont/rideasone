angular.module('carpoolingVan')

.controller("rideCtrl", function($scope, usersService, $stateParams,
  routesService, mapFactory) {

  var route = $stateParams.route;
  routesService.getRoute(route.$id).then(function(r) {
    $scope.route = r;

    if($scope.route.passengers) {
      setPassengerInfo();
      initMap();
    }
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
    angular.forEach($scope.route.passengers, function(p, id) {
      usersService.get(id).then(function(u) {
        $scope.route.passengers[id].info = u;
      });
    });
  }

  function initMap() {
    var markers = [];

    mapFactory.drawMap().then(function(map) {
      angular.forEach($scope.route.passengers, function(p) {
        if(p.info && p.info.location && p.info.location.lat && p.info.location.lng) {
          markers.push({
            location: {
              latitude: p.info.location.lat,
              longitude: p.info.location.lng
            },
            icon: p.info.image + "?sz=30",
            info: p.info.name + "<br>" + p.info.location.address
          });
        }
      });

      mapFactory.setMarkers(markers);
    });
  }
});
