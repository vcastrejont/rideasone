angular.module('carPoolingApp').controller('eventsCtrl', eventsCtrl);

eventsCtrl.$inject = ['$scope', '$http' ];

function eventsCtrl ($scope, $http) {
  $scope.events = {};
  $http.get('/api/events')
    .success(function(data) {
        $scope.events = data;
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
}
