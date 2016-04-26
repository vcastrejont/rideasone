angular.module('carpoolingVan')

.controller("routesCtrl", function($scope, routesService, usersService,
  mapFactory, $ionicPopup, $ionicListDelegate, $stateParams) {

  $scope.route = $stateParams.route;
  $scope.users = usersService.users;
  $scope.routes = routesService.routes;
  $scope.addRoute = addRoute;
  $scope.start = start;
  $scope.stop = stop;
  $scope.addUserToRoute = addUserToRoute;
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
    if(!$scope.route.passengers) {
      $scope.route.passengers = {};
    }
    $scope.route.passengers[user.$id] = user;

    routesService.addUser(user, $scope.route, $scope.routes);
  }

  function deleteUser(user) {
    angular.forEach($scope.route.passengers, function(p, id)
    {
      if(id == user.$id) {
        delete $scope.route.passengers[id];
      }
    });

    routesService.deleteUser(user, $scope.route).then(null, function(error) {
      alert(error);
    });
  }

  function addUserToRoute(user, flag) {
    if(!flag){
      addUser(user);
    }
    else {
      deleteUser(user);
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
