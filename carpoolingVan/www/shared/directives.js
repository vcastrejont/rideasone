angular.module('carpoolingVan')

.directive("userRouteItem", function(authFactory, routesService, $ionicListDelegate) {
  return {
    restrict: 'E',
    link: function($scope, $elem, $attr) {
      $scope.user = authFactory.currentUser();

      $scope.toggleUserInRoute = function() {
        if(!$scope.$parent.route.passengers ||
        !$scope.$parent.route.passengers[$scope.user.$id]){
          join();
        }
        else {
          leave();
        }
        $ionicListDelegate.closeOptionButtons();
      };

      function join() {
        if(!$scope.$parent.route.passengers) {
          $scope.$parent.route.passengers = {};
        }
        $scope.$parent.route.passengers[$scope.user.$id] = $scope.user;

        routesService.addUser($scope.user, $scope.$parent.route);
      }

      function leave() {
        angular.forEach($scope.$parent.route.passengers, function(p, id)
        {
          if(id == $scope.user.$id) {
            delete $scope.$parent.route.passengers[id];
          }
        });

        routesService.deleteUser($scope.user, $scope.$parent.route).then(null,
        function(error) {
          alert(error);
        });
      }
    },
    templateUrl: 'components/routes/userRouteTmpl.html'
  };
})

.directive("driverRouteItem", function(routesService, $ionicListDelegate) {
  return {
    restrict: 'E',
    link: function($scope, $elem, $attr) {
      $scope.start = start;
      $scope.stop = stop;

      function start() {
        routesService.start($scope.$parent.route).then(function(success) {
          if(success) {
            alert("Yay, let's drive!");
          }
          else {
            alert("Oh, oh... something went wrong :(");
          }
          $ionicListDelegate.closeOptionButtons();
        }, function(error) {
          alert(error);
        });
      }

      function stop(route) {
        routesService.stop($scope.$parent.route).then(function(success) {
          if(success) {
            alert("Yes, you made it!");
          }
          else {
            alert("Oh, oh... something went wrong :(");
          }
          $ionicListDelegate.closeOptionButtons();
        }, function(error) {
          alert(error);
        });
      }
    },
    templateUrl: 'components/routes/driverRouteTmpl.html'
  };
});
