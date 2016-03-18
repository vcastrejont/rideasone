angular.module('carpoolingVan')

.controller("routesCtrl", function($scope, routesService, usersService,
  $ionicModal, $ionicListDelegate) {

  $scope.users = usersService.users;
  $scope.routes = routesService.routes;
  $scope.addRoute = addRoute;
  $scope.showUsers = showUsers;
  $scope.showAllUsers = showAllUsers;
  $scope.addUserToRoute = addUserToRoute;
  $scope.pickupUser = pickupUser;

  // Global function from adding button template
  // $scope.addFunction = $scope.addPassenger;

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
    delete $scope.route;
  });

  $scope.$on('modal.hidden', function() {
    $ionicListDelegate.closeOptionButtons();
  });

  function addRoute () {
    var time = prompt("Type the time of departure");

    if (time) {
      $scope.routes.$add({
        "time": time
      });
    }
  };

  function addUser(user, route) {
    angular.forEach($scope.routes, function(r) {
      if(r.$id == route.$id) {
        routesService.addUser(user, route)
        .then(null, function errorAddUser(error) {
          alert(error);
        });
      }
      else {
        routesService.deleteUser(user, r)
        .then(null, function errorDeleteUser(error) {
          alert(error);
        });
      }
    })
  };

  function deleteUser(user, route) {
    routesService.deleteUser(user, route)
    .then(null, function errorDeleteUser(error) {
      alert(error);
    });
  };

  function addUserToRoute(user, route, flag) {
    if(flag === undefined){
      addUser(user, route);
    }
    else {
      deleteUser(user, route);
    }
  }

  function pickupUser(user, route, flag) {
    routesService.pickupUser(user, route, flag)
    .then(null, function errorDeleteUser(error) {
      alert(error);
    });
  }

  function showAllUsers(route) {
    $scope.route = route;

    $ionicModal.fromTemplateUrl('templates/routeAddUserModal.html', {
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
  };

  function showUsers(route) {
    $scope.route = route;

    $ionicModal.fromTemplateUrl('templates/routeUsersModal.html', {
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
    };
  }
});
