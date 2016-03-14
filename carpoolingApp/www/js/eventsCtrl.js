angular.module('carpooling.controllers')

.controller('EventsCtrl', function($scope, carpoolingData) {
  $scope.events = carpoolingData;
});
