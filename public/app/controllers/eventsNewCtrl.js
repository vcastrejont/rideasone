angular.module('carPoolingApp').controller('eventsNewCtrl', eventsNewCtrl);

eventsNewCtrl.$inject = ['$scope', 'apiservice', 'mapService',  '$state','mapFactory' ];

function eventsNewCtrl ($scope, apiservice, mapService, $state, mapFactory ) {
  $scope.event = {
    date: new Date()
  };
  
  $scope.map = mapFactory.getApi();
  $scope.place = $scope.map.placesAutocomplete('autocomplete');
  $scope.saveData = function() {
    apiservice.createEvent($scope.event)
      .success(function(res, status) {
        if (res.ok)
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
};
