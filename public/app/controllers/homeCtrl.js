angular.module('carPoolingApp').controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$rootScope','$scope', '$window', 'apiservice','mapFactory'];

function homeCtrl ($rootScope, $scope, $window, apiservice, mapFactory ) {

  $scope.api = mapFactory.getApi();
  $scope.api.defaultLocation();
  $rootScope.$on('mapFactory:success', function () {
    console.log("yay!");
    $scope.api = mapFactory.getApi();
    console.log($scope.api);
  });

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
