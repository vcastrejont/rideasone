angular.module('carPoolingApp').controller('eventsNewCtrl', eventsNewCtrl);

eventsNewCtrl.$inject = ['$scope', 'apiservice', 'mapService',  '$state' ];

function eventsNewCtrl ($scope, apiservice, mapService, $state) {
  $scope.location = {};
  $scope.event = {
    date: new Date()
  };
  $scope.displayDate= false;
  $scope.injectedObject = {test:'hello'};

  
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
