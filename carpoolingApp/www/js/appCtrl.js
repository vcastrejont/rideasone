angular.module('carpooling.controllers')

.controller('AppCtrl', ["$scope", "AuthService", function($scope, AuthService) {
  $scope.currentUser = null;
  $scope.isAuthenticated = AuthService.isAuthenticated;

  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };
}]);
