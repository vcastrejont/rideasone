angular.module('carpooling.controllers.events', [])

.controller('EventsCtrl', function($scope, carpoolingData) {
  $scope.events = carpoolingData;
});
