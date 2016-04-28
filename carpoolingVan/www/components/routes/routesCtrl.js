angular.module('carpoolingVan')

.controller("routesCtrl", function($scope, routesService, authFactory,
  popupService) {

  $scope.user = authFactory.currentUser();
  $scope.routes = routesService.routes;
  $scope.addRoute = addRoute;

  function addRoute() {
    popupService.showPrompt('New route', 'Type the time of departure',
    function(time) {
      $scope.routes.$add({
        "time": time
      });
    });
  }
});
