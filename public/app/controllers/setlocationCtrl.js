angular.module('carPoolingApp').controller('setlocationCtrl', setlocationCtrl);

setlocationCtrl.$inject = ['$scope', '$http', '$state','$window'];

function setlocationCtrl ($scope, $http,  $state, $window) {
  $scope.view= {
    alerts:[],
    signed:false,
    seats: "",
    driver:"",
    signmeup: true,
    option:1,
    user:{
      id: $window.user_id,
      name: $window.user_name,
    },
    showMap:function(){
      var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 12,
        disableDefaultUI: true
      });
    
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(pos);
        }, function() {
          handleLocationError(true, map.getCenter());
        });
      } else {
        handleLocationError(false,  map.getCenter());
      }
    }
    
  };


    
  $scope.view.showMap();
  
};

function handleLocationError(browserHasGeolocation, pos) {
  
}
