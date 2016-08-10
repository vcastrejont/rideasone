angular.module('carPoolingApp').controller('eventsNewCtrl', eventsNewCtrl);

eventsNewCtrl.$inject = ['$scope', 'apiservice',  '$state','mapFactory' ];

function eventsNewCtrl ($scope, apiservice, $state, mapFactory ) {

  $scope.map = mapFactory.getApi();
  $scope.map.currentLocation();
  $scope.map.placesAutocomplete('autocomplete');
  
  
  $scope.saveData = function() {
    var eventData = $.extend($scope.event, mapFactory.getEventLocationData());
    console.log(eventData);
    var newEvent={
      "name": eventData.name,
      "description": eventData.description,
      "place": {
          "name": eventData.place_name,
          "google_places_id": eventData.place_id,
          "address": eventData.address,
          "location": [29.099634,-110.951714]
      },
      "starts_at": eventData.datetime,
      "ends_at":""
    };
    console.log(newEvent);
    apiservice.createEvent(newEvent)
      .success(function(res, status) {
          //$scope.map.defaultLocation();
          $scope.apiSuccess = true;
          //$state.go('events');
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
