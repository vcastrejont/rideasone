angular.module('carPoolingApp').controller('eventsNewCtrl', eventsNewCtrl);

eventsNewCtrl.$inject = ['$scope', 'apiservice',  '$state','mapFactory' ];

function eventsNewCtrl ($scope, apiservice, $state, mapFactory ) {

  $scope.map = mapFactory.getApi();
  $scope.map.currentLocation();
  $scope.map.placesAutocomplete('autocomplete');
  
  $scope.setDate = function() {
    $scope.event.endDate =  $scope.event.endDate || $scope.event.startDate;
  };
  
  $scope.setTime = function() {
    $scope.event.endTime=  moment($scope.event.startTime).add(1, 'hours');
  };

  
  $scope.timePickerOptions = {
    step: 30,
    timeFormat: 'g:ia',
    'minTime': '8:00am',
    'maxTime': '7:30am'
  };

  
  $scope.saveData = function() {
    console.log( moment($scope.event.startDate).format('MMMM Do YYYY'));
    //$scope.event.starts_at = moment( );
      
      
               
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
