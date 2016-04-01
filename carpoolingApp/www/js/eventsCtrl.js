angular.module('carpooling.controllers')

.controller('eventsCtrl', function($scope, eventsFactory) {
  eventsFactory.getAll()
  .then(function(events) {
    $scope.events = events;
  });
});
