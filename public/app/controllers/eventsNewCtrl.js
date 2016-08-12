angular.module('carPoolingApp').controller('eventsNewCtrl', eventsNewCtrl);

eventsNewCtrl.$inject = ['$scope', 'apiservice',  '$state','mapFactory' ];

function eventsNewCtrl ($scope, apiservice, $state, mapFactory ) {

  $scope.map = mapFactory.getApi();
  $scope.map.currentLocation();
  $scope.map.placesAutocomplete('autocomplete');
  
  $scope.setDate = function() {
    //console.log("setDate");
    $scope.event.endDate =  $scope.event.endDate || $scope.event.startDate;
  };
  $scope.$watch('event.name', function(newvalue,oldvalue) {
    // console.log(newvalue);
    // $scope.event.endDate =  $scope.event.endDate || newvalue;
  //  console.log(newvalue);
  });
  
  $scope.setTime = function() {
    //var temp = moment($scope.event.startTime);
    //console.log(temp);
    //$scope.event.endTime= temp;
  };
  
  $scope.$watch('event.starttime', function(newvalue,oldvalue) {
      //console.log(newvalue);
  });
  
  $scope.timePickerOptions = {
    step: 30,
    timeFormat: 'g:ia',
    'minTime': '2:00pm',
    'maxTime': '11:30pm',
    'showDuration': true
  };

  
  $scope.saveData = function() {
    console.log($scope.event);
    var eventData = $.extend($scope.event, mapFactory.getEventLocationData());
    $scope.map.clearMarks();
    // console.log(eventData);
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
    // console.log(newEvent);
    apiservice.createEvent(newEvent)
      .success(function(res, status) {
          $scope.map.currentLocation();
          $scope.apiSuccess = true;
          $state.go('events');
      })
      .error(function(data) {
        console.error('Error: ' + data);
      });
  };



}
