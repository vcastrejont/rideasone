angular.module('carpoolingVan')

.controller("routesCtrl", function($scope, routesService, usersService,
  mapFactory, popupService, $ionicListDelegate, $stateParams) {

  $scope.route = $stateParams.route;
  $scope.routes = routesService.routes;
  $scope.addRoute = addRoute;
  $scope.passengerCount = passengerCount;

  function addRoute() {
    popupService.showPrompt('New route', 'Type the time of departure',
    function(time) {
      $scope.routes.$add({
        "time": time
      });
    });
  }

  function passengerCount(route) {
    var count = 0;

    if(route.passengers) {
      angular.forEach(route.passengers, function(p) {
        if(!p.bypass) {
          count++;
        }
      });
    }

    return count;
  }
});
