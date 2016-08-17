angular.module('carPoolingApp').controller('eventsNewCtrl', eventsNewCtrl);

eventsNewCtrl.$inject = ['$scope', 'apiservice',  '$state','mapFactory' ];

function eventsNewCtrl ($scope, apiservice, $state, mapFactory ) {
  $scope.event = {
    date: new Date()
  };
  
  $scope.map = mapFactory.getApi();
  $scope.map.placesAutocomplete('autocomplete');
  $scope.saveData = function() {
    var eventData = $.extend($scope.event, mapFactory.getEventLocationData());
    apiservice.createEvent(eventData)
      .success(function(res, status) {
          $scope.map.defaultLocation();
          $scope.apiSuccess = true;
          $state.go('events');
      })
      .error(function(data) {
        console.error('Error: ' + data);
      });
  };
  $scope.initTimepicker = function () {
    $(function () {
     $('.timepicker').timepicker({
       timeFormat: 'h:mm p',
       interval: 60,
       minTime: '1',
       maxTime: '11:00pm',
       defaultTime: '11',
       startTime: '12:00',
       dynamic: false,
       dropdown: true,
       scrollbar: true
     });
    });

  };

  $scope.initTimepicker();
}
