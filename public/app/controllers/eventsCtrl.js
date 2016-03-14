angular.module('carPoolingApp').controller('eventsCtrl', eventsCtrl);

eventsCtrl.$inject = ['$scope', '$http' ];

function eventsCtrl ($scope, $http) {
  $scope.events = [];
  $http.get('/api/events')
    .success(function(data) {
        _.each(data, function(element, index) {
          var event = element;
          event.seats = 0;
          event.lift = _.where(element.attendees, {lift: true});
          _.each(event.carpooling, function(element, index) {
            event.seats += element.seats;
          });
          $scope.events.push(event);
        });
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
}
