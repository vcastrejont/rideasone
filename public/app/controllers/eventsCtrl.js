angular.module('carPoolingApp').controller('eventsCtrl', eventsCtrl);

eventsCtrl.$inject = ['$scope', 'apiservice' ];

function eventsCtrl ($scope, apiservice) {
  $scope.events = [];
  $scope.filters = {
    search: '',
    order: 'datetime'
  };
  $scope.categories = [ 'Hermosillo','Chihuahua','CDMX'];
  apiservice.getEvents()
    .success(function(data) {
        _.each(data, function(element, index) {
          var event = element;
          event.seats = 0;
          event.avail = 0;
          event.used_seats = 0;

          event.lift = _.where(element.attendees, {lift: true});
          _.each(event.carpooling, function(car, index) {

            var avail = car.seats -  car.passanger.length;
            event.avail += avail;

          });

          $scope.events.push(event);
        });
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
  $scope.checkDate = function(datetime){
    var now = new Date();
    var eventdate = new Date(datetime);
    if (eventdate < now) {
      return true;
    }

  }
}
