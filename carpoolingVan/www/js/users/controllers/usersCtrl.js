angular.module('carpoolingVan')

.controller("usersCtrl", function($scope, usersService, $state, mapFactory,
  $ionicLoading, popupService, authFactory) {

  $scope.users = usersService.users;
  $scope.updateUser = updateUser;

  function updateUser() {
    usersService.update($scope.user)
    .then(function okUpdateUser() {
      popupService.alert("User updated", "The information was successfully updated");
      $state.go("van.users");
    },
    function errorUpdateUser(error) {
      alert(error);
    });
  }

  function initMap(location) {
    return mapFactory.drawMap(location)
    .then(function(map) {
      var marker;

      if(location) {
        marker = mapService.addMarker(location.lat, location.lng);
      }
      else {
        marker = mapService.createEmptyMarker();
      }

      var searchInput = document.getElementById('autocomplete');
      autocomplete = new google.maps.places.Autocomplete(searchInput);
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
    });
  }
});
