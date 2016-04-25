angular.module('carpoolingVan')

.controller("routesCtrl", function($scope, routesService, usersService,
  mapFactory, $ionicPopup, $ionicListDelegate, $stateParams) {

  $scope.route = $stateParams.route;
  $scope.users = usersService.users;
  $scope.routes = routesService.routes;
  $scope.addRoute = addRoute;
  $scope.start = start;
  $scope.stop = stop;
  $scope.showPassengersModal = showPassengersModal;
  $scope.addUserToRoute = addUserToRoute;
  $scope.pickupUser = pickupUser;
  $scope.bypassUser = bypassUser;
  $scope.passengerCount = passengerCount;

  $scope.getUserName = function(userId) {
    return usersService.get(userId).then(function(user) {
      return user.name;
    });
  };

  function addRoute () {
    $ionicPopup.prompt({
      title: 'New route',
      template: 'Type the time of departure'
    }).then(function(time) {
      $scope.routes.$add({
        "time": time
      });
    });
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

  function addUser(user) {
    routesService.addUser(user, $scope.route, $scope.routes);
  }

  function deleteUser(user) {
    routesService.deleteUser(user, $scope.route).then(null, function(error) {
      alert(error);
    });
  }

  function addUserToRoute(user, flag) {
    if(flag === undefined){
      addUser(user);
    }
    else {
      deleteUser(user);
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

  function showPassengersModal(route, role) {
    $scope.role = role;
    $scope.route = route;

    if(route.passengers) {
      $ionicModal.fromTemplateUrl(
        'templates/routes/passengersModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then(function(modal) {
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
    else {
      alert("No folks in this route yet :(");
    }
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
