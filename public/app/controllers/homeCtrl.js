angular.module('carPoolingApp').controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$scope', '$window', '$state', 'apiservice'];

function homeCtrl ($scope, $window, $state, apiservice) {
    if (!window.user.location_lat) {
        $state.go('setlocation');
    };

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
