angular.module('carpoolingVan')

.controller("routesCtrl", function($scope, routesService, usersService,
  mapService, $ionicModal, $ionicListDelegate) {

  $scope.users = usersService.users;
  $scope.routes = routesService.routes;

  $scope.addRoute = addRoute;
  $scope.start = start;
  $scope.stop = stop;
  $scope.showPassengersModal = showPassengersModal;
  $scope.showAllUsers = showAllUsers;
  $scope.addUserToRoute = addUserToRoute;
  $scope.pickupUser = pickupUser;
  $scope.bypassUser = bypassUser;
  $scope.passengerCount = passengerCount;

  $scope.$on('$destroy', function() {

    $scope.modal.remove();
    delete $scope.route;
    delete $scope.role;
  });

  $scope.$on('modal.hidden', function() {

    $ionicListDelegate.closeOptionButtons();
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  function addRoute () {

    var time = prompt("Type the time of departure");

    if (time) {
      $scope.routes.$add({
        "time": time
      });
    }
  }

  function start(route) {

    routesService.start(route)
    .then(function okStartRoute(res) {
      if(res.data) {
        alert("Yay, let's drive!");
        $ionicListDelegate.closeOptionButtons();
      }
      else {
        alert("Oh, oh... something went wrong :(");
        $ionicListDelegate.closeOptionButtons();
      }
    }, function errorStartRoute(error) {
      alert(error);
    });
  }

  function stop(route) {

    routesService.stop(route)
    .then(function okStopRoute(res) {
      if(res.data) {
        alert("Yes, you made it!");
        $ionicListDelegate.closeOptionButtons();
      }
      else {
        alert("Oh, oh... something went wrong :(");
        $ionicListDelegate.closeOptionButtons();
      }
    }, function errorStartRoute(error) {
      alert(error);
    });
  }

  function addUser(user, route) {

    routesService.addUser(user, route, $scope.routes);
  }

  function deleteUser(user, route) {

    routesService.deleteUser(user, route)
    .then(null, function errorDeleteUser(error) {
      alert(error);
    });
  }

  function addUserToRoute(user, route, flag) {

    if(flag === undefined){
      addUser(user, route);
    }
    else {
      deleteUser(user, route);
    }
  }

  function pickupUser(userId, route, flag) {

    routesService.pickupUser(userId, route, !flag)
    .then(null, function errorPickupUser(error) {
      alert(error);
    });
  }

  function bypassUser(userId, route, bypass) {

    routesService.bypassUser(userId, route, !bypass)
    .then(null, function errorBypassUser(error) {
      alert(error);
    });
  }

  function showAllUsers(route) {

    $scope.route = route;

    $ionicModal.fromTemplateUrl(
      'templates/routes/routeAddUserModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.openModal();
    });
  }

  function showPassengersModal(route, role) {

    $scope.role = role;
    $scope.route = route;

    $ionicModal.fromTemplateUrl(
    'templates/routes/passengersModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;

      mapService.initMap()
      .then(function(map) {
        angular.forEach($scope.route.passengers, function(p) {
          if(!p.bypass && !p.onboard) {
            mapService.addMarker(p.location.lat, p.location.lng);
          }
        });
      });

      $scope.openModal();
    });
  }

  function passengerCount(route) {

    var count = 0;

    if(route.passengers) {
      Object.keys(route.passengers).map(function() {
        count++;
      });
    }

    return count;
  }
});
