angular.module('carpooling.controllers.profile', [])

.controller('ProfileCtrl', function($scope) {
  $scope.profile = {
    username: 'Username',
    avatar: 'avatar.jpg',
    location: {
      name: 'User location name',
      coordinates: {
        lat: 10.00000,
        lng: 9.0000000
      }
    }
  }
});
