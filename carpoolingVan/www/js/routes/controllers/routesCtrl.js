angular.module('carpoolingVan')

.controller("routesCtrl", function($scope, routesService, usersService,
  $ionicModal, $ionicListDelegate) {

  $scope.routes = routesService.routes;
  $scope.addRoute = addRoute;
  $scope.addPassenger = addPassenger;
  $scope.showUsers = showUsers;
  $scope.users = usersService.users;

  // Global function from adding button template
  $scope.addFunction = $scope.addPassenger;

  function addRoute () {
    var time = prompt("Type the time of departure");

    if (time) {
      $scope.routes.$add({
        "time": time
      });
    }
  };

  function addPassenger(user, route) {
    usersService.patch(user, route)
    .then(function okUserPatch(data) {
      console.log(data);

      $scope.closeModal();

      $ionicListDelegate.closeOptionButtons();
    },
    function errorUserPatch(error) {
      console.log(error);
    });
  };

  function getPassengers(route) {
    return routesService.passengers(route);
  }

  function showUsers(route) {
    $scope.route = route;

    $ionicModal.fromTemplateUrl('/templates/routeModal.html', {
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
      $ionicListDelegate.closeOptionButtons();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    $scope.$on('modal.hidden', function() {
      $ionicListDelegate.closeOptionButtons();
    });
  }
});
