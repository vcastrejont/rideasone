angular.module('carPoolingApp').controller('myCarpoolingCtrl', myCarpoolingCtrl);

myCarpoolingCtrl.$inject = ['$scope', '$http','$window' ];

function myCarpoolingCtrl ($scope, $http, $window) {
  $scope.users = [];
  $http.get('/api/users')
    .success(function(data) {
        $scope.users=data;
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
  $http.get('/api/events')
    .success(function(data) {
        $scope.events=data;
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
  $http.get('/api/events_driver/'+$window.user_id)
    .success(function(data) {
        $scope.rides=data;
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
}
