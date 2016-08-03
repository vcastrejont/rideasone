angular.module('carPoolingApp').controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$rootScope','$scope', '$window', 'apiservice','mapFactory'];

function homeCtrl ($rootScope, $scope, $window, apiservice, mapFactory ) {

  $scope.user=sessionservice.user();
  $scope.api = mapFactory.getApi();
  
  
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
