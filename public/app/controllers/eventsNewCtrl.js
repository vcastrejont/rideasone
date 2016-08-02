angular.module('carPoolingApp').controller('eventsNewCtrl', eventsNewCtrl);

eventsNewCtrl.$inject = ['$scope', 'apiservice', 'mapService',  '$state','mapFactory' ];

function eventsNewCtrl ($scope, apiservice, mapService, $state, mapFactory ) {
  $scope.location = {};
  $scope.event = {
    date: new Date()
  };
  $scope.api = mapFactory.getApi();
  $scope.api.defaultLocation();
  
  $scope.displayDate= false;
  

  
  $scope.api.placesAutocomplete('autocomplete');
  
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
