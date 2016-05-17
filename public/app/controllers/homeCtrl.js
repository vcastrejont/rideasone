angular.module('carPoolingApp').controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$scope', '$window', 'apiservice'];

function homeCtrl ($scope, $window, apiservice) {
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
