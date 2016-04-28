angular.module('carpoolingVan')

.directive("routeItem", function(routesService, $ionicListDelegate, popupService) {
  return {
    restrict: 'E',
    link: function($scope) {
      $scope.toggleUserInRoute = toggleUserInRoute;
      $scope.passengerCount = passengerCount;
      $scope.bypass = bypass;
      $scope.start = start;
      $scope.stop = stop;

      function toggleUserInRoute() {
        if(!$scope.route.passengers ||
        !$scope.route.passengers[$scope.user.$id]){
          join();
        }
        else {
          leave();
        }
        $ionicListDelegate.closeOptionButtons();
      };

      function passengerCount() {
        var count = 0;

        if($scope.route.passengers) {
          angular.forEach($scope.route.passengers, function(p) {
            if(!p.bypass) {
              count++;
            }
          });
        }
        return count;
      };

      function bypass(flag) {
        var user = authFactory.currentUser();
        routesService.bypass(null, $scope.route, !flag).then(user.$id, function(error) {
          popupService.showAlert("Error", error);
        });
        $ionicListDelegate.closeOptionButtons();
      };

      function join() {
        routesService.join($scope.route).then(null,
        function(error) {
          popupService.showAlert("Error", error);
        });
      }

      function leave() {
        routesService.leave($scope.route).then(null,
        function(error) {
          popupService.showAlert("Error", error);
        });
      }

      function start() {
        routesService.start($scope.$parent.route).then(function(success) {
          if(success) {
            popupService.showAlert("Start route", "Yay, let's drive!");
          }
          else {
            popupService.showAlert("Error", "Oh, oh... something went wrong");
          }
          $ionicListDelegate.closeOptionButtons();
        }, function(error) {
          popupService.showAlert("Error", error);
        });
      }

      function stop(route) {
        routesService.stop($scope.$parent.route).then(function(success) {
          if(success) {
            popupService.showAlert("Stop route", "Yes, you made it!");
          }
          else {
            popupService.showAlert("Error", "Oh, oh... something went wrong");
          }
          $ionicListDelegate.closeOptionButtons();
        }, function(error) {
          popupService.showAlert("Error", error);
        });
      }
    },
    templateUrl: 'components/routes/routeTmpl.html'
  };
});
