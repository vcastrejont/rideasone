angular.module('carpoolingVan')

.controller("usersCtrl", function($scope, usersService) {
  $scope.users = usersService.users;
});
