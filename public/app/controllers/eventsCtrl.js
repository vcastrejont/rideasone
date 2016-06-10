angular.module('carPoolingApp').controller('eventsCtrl', homeCtrl);

eventsCtrl.$inject = ['$scope', '$window', 'apiservice'];

function eventsCtrl ($scope, $window, apiservice) {
  apiservice.getEvents()
    .success(function(data) {
        $scope.nextEvents=data;
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
  apiservice.getPastEvents()
    .success(function(data) {
        $scope.pastEvents=data;
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
}
