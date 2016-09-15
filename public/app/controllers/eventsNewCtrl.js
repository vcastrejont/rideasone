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
    var starts_date = moment($scope.event.startDate).format('YYYY-MM-DD');
    var starts_time = moment($scope.event.startTime).format('HH:mm');
    var starts_at = moment(starts_date+" "+starts_time, "YYYY-MM-DD HH:mm").utc().format();
    var ends_date = moment($scope.event.endDate).format('YYYY-MM-DD');
    var ends_time = moment($scope.event.endTime).format('HH:mm');
    var ends_at = moment(ends_date+" "+ends_time, "YYYY-MM-DD HH:mm").utc().format();
    
    //console.log(starts_at);
    //$scope.event.starts_at = moment( );
      
               
  //  console.log($scope.event);
    var eventData = $.extend($scope.event, mapFactory.getEventLocationData());
    $scope.map.clearMarks();
     
    var newEvent={
      "name": eventData.name,
      "description": eventData.description,
      "place": {
          "name": eventData.place_name,
          "google_places_id": eventData.place_id,
          "address": eventData.address,
          "location": {
            "lat": eventData.location.lat,
            "lon": eventData.location.lon
          }
      },
      "starts_at": starts_at,
      "ends_at": ends_at
    };
    console.log(newEvent);
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
