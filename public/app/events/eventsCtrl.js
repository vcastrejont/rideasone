angular.module('carPoolingApp').controller('eventsCtrl', eventsCtrl);

eventsCtrl.$inject = ['$scope', '$http', 'mapService' ];

function eventsCtrl ($scope, $http, mapService) {
  
      $scope.place = {};
      
      $scope.search = function() {
          $scope.apiError = false;
          mapService.search($scope.searchPlace)
          .then(
              function(res) { // success
                  mapService.addMarker(res);
                  $scope.place.name = res.name;
                  $scope.place.lat = res.geometry.location.lat();
                  $scope.place.lng = res.geometry.location.lng();
              },
              function(status) { // error
                  $scope.apiError = true;
                  $scope.apiStatus = status;
              }
          );
      };
      
      $scope.send = function() {
        var data = {
           name: $scope.place.name,
           location: [$scope.place.lng, $scope.place.lat ],
           events:{
             date:Date.now(),
             name:$scope.event_title
           }   
        };
        console.log(data);
        $http.post("/locations", data).success(function(res, status) {
          $scope.apiSuccess = true;
          setTimeout(function () {
            window.location.href = "/events";
          }, 2000); 
        })
      };
      
      mapService.init();
}
