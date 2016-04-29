angular.module('carpoolingVan')

.controller("profileCtrl", function($scope, authFactory, usersService, mapFactory,
  popupService, $state) {

  $scope.update = update;
  $scope.user = authFactory.currentUser();

  (function initAutocompleteMap() {
    mapFactory.drawAutocompleteMap($scope.user.location, $scope);
  })();

  function update() {
    usersService.update($scope.user).then(function() {
      popupService.showAlert("Done!", "User was succesfully updated", function() {
        $state.go("van.users");
      });
    }, function(error) {
      popupService.showAlert("Error!", error);
    });
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
