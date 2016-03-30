angular.module('carpoolingVan')

.controller("userCtrl", function($scope, $stateParams, usersService, mapService) {

  //this should be a service and should handle responses for asyncrounous calls
  var handler = {
    users: {
      success: function (res) {
        $scope.user = res;
        initMap();
        // initMap().then(function(map) {
        //   $scope.map = map;
        // });
      },
      error: function (res) {
        //do something. throw error
      }
    }
  }

  $scope.updateUser = updateUser;
  $scope.userId = $stateParams.userId;

  $scope.user = usersService.get($scope.userId)
  .then(handler.users.success, handler.users.error);

  function updateUser() {

    usersService.update($scope.user)
    .then(function() {
      alert("Done!");
    }, function errorUpdateUser(error) {
      alert(error);
    });
  }

  function initMap(location) {

    var marker;
    var location = location || $scope.user.location;
    var map = mapService.initMap(location);
    var searchInput = document.getElementById('autocomplete');
    var autocomplete = new google.maps.places.Autocomplete(searchInput);

    if(location) {
      marker = mapService.addMarker(location.lat, location.lng);
    }
    else {
      marker = mapService.createEmptyMarker();
    }

    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', function getLatLng() {

      var place = autocomplete.getPlace();

      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      marker.setPosition(place.geometry.location);

      $scope.user.location.lat = place.geometry.location.lat();
      $scope.user.location.lng = place.geometry.location.lng();
    });

    return map;
  }
});
