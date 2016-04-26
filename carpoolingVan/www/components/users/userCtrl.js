angular.module('carpoolingVan')

.controller("userCtrl", function($scope, $stateParams, usersService, mapFactory,
  popupService, $state) {

  $scope.updateUser = updateUser;
  $scope.userId = $stateParams.userId;

  usersService.get($scope.userId).then(function (res) {
    $scope.user = res;
    initAutocompleteMap($scope.user.location);
  }, function(error) {
    popupService.showAlert("Error!", error);
  });

  function updateUser() {
    usersService.update($scope.user).then(function() {
      popupService.showAlert("Done!", "User was succesfully updated", function() {
        $state.go("van.users");
      });
    }, function(error) {
      popupService.showAlert("Error!", error);
    });
  }

  function initAutocompleteMap(loc) {
    mapFactory.drawAutocompleteMap(loc, $scope);
  }

  function updatePosition(place) {
    $scope.user.location.lat = place.geometry.location.lat();
    $scope.user.location.lng = place.geometry.location.lng();
    $scope.user.location.address = place.formatted_address;
  }

  $scope.$on('mapFactory::updatePosition', function (e, place) {
    updatePosition(place);
  });
});
