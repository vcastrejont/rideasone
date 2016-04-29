angular.module('carpoolingVan')

.directive("routeItem", function(routesService, $ionicListDelegate, popupService,
  authFactory, geolocationSocket, $interval) {

  var intervalId;

  return {
    restrict: 'E',
    link: function($scope) {
      $scope.join = join;
      $scope.leave = leave;
      $scope.passengerCount = passengerCount;
      $scope.bypass = bypass;
      $scope.start = start;
      $scope.stop = stop;

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
        routesService.bypass(user.$id, $scope.route, !flag).then(function() {
          geolocationSocket.redrawMarkers();
        }, function(error) {
          popupService.showAlert("Error", error);
        });
        $ionicListDelegate.closeOptionButtons();
      };

      function join() {
        routesService.join($scope.route).then(function() {
          geolocationSocket.redrawMarkers();
        },
        function(error) {
          popupService.showAlert("Error", error);
        });
        $ionicListDelegate.closeOptionButtons();
      }

      function leave() {
        routesService.leave($scope.route).then(function() {
          geolocationSocket.redrawMarkers();
        },
        function(error) {
          popupService.showAlert("Error", error);
        });
        $ionicListDelegate.closeOptionButtons();
      }

      function start() {
        routesService.start($scope.$parent.route).then(function(success) {
          if(success) {
            intervalId = $interval(function() {
              geolocationSocket.shareDriverLocation();
            }, 5000);
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
            if(intervalId) {
              $interval.cancel(intervalId);
              intervalId = undefined;
            }
            geolocationSocket.stopSharingLocation();
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
