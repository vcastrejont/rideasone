angular.module('carpoolingVan')

.controller("userCtrl", function($scope, $stateParams, usersService, mapFactory,
  $ionicPopup, $state) {

  //this should be a service and should handle responses for asyncrounous calls
  var handler = {
    users: {
      success: function (res) {
        $scope.user = res;
        initAutocompleteMap($scope.user.location);
      },
      error: function (res) {
        //do something. throw error
        return res;
      }
    }
  };

  $scope.updateUser = updateUser;
  $scope.userId = $stateParams.userId;

  $scope.user = usersService.get($scope.userId).then(handler.users.success, handler.users.error);

  function updateUser() {
    usersService.update($scope.user).then(function() {
      $ionicPopup.alert({
        title: "Done!",
        template: "User was succesfully updated"
      });
      $state.go("van.users");
    }, function errorUpdateUser(error) {
      $ionicPopup.alert({
        title: "Error!",
        template: error
      });
    });
  }

  function initAutocompleteMap(loc) {
    var marker;

    mapFactory.drawMap().then(function(map) {
      var searchInput = document.getElementById('autocomplete');
      var autocomplete = new google.maps.places.Autocomplete(searchInput);

      if(loc) {
        var markers = mapFactory.setMarkers([{
          location: {
            latitude: loc.lat,
            longitude: loc.lng
          }
        }]);

        marker = markers[0];
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

        if(!marker) {
          marker = new google.maps.Marker({map: map});
        }

        marker.setPosition(place.geometry.location);

        $scope.user.location.lat = place.geometry.location.lat();
        $scope.user.location.lng = place.geometry.location.lng();
        $scope.user.location.address = place.formatted_address;
      });
    });
  }
});
