angular.module('carpoolingVan')

.controller("usersCtrl", function($scope, usersService, $ionicModal, mapService,
  $ionicLoading, popupService) {

  $scope.users = usersService.users;
  $scope.addUser = addUser;
  $scope.saveUser = saveUser;
  $scope.updateUser = updateUser;
  $scope.viewInfo = viewInfo;
  $scope.showDeleteUserModal = showDeleteUserModal;
  

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
    $scope.user;
  });

  function addUser() {
    $ionicLoading.show({
      template: 'Loading map'
    });

    $scope.user = {};

    $ionicModal.fromTemplateUrl('templates/users/newUserModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;

      initMap()
      .then(function(map) {
        $scope.map = map;
        $ionicLoading.hide();
      });

      $scope.openModal();
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
  }

  function saveUser() {
    $scope.users.$add($scope.user)
    .then(function okSaveUser() {
      $scope.closeModal();
    },
    function errorSaveUser(error) {
      console.log(error);
    });
  }

  function updateUser() {

    usersService.update($scope.user)
    .then(function okUpdateUser() {
      $scope.closeModal();
    },
    function errorUpdateUser(error) {
      alert(error);
    });
  }

  function showDeleteUserModal(userId) {

    popupService.showConfirm("Delete user", "Are you sure?", function() {
      deleteUser(userId)
      .then(function() {
        alert("User removed");
      });
    });
  }

  function deleteUser(userId) {
    return usersService.remove(userId);
  }

  function viewInfo(user) {
    $scope.user = user;

    $ionicModal.fromTemplateUrl('templates/users/userModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;

      initMap(user.location)
      .then(function(map) {
        $scope.map = map;
      });

      $scope.openModal();
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
  }

  function initMap(location) {

    return mapService.initMap(location)
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
