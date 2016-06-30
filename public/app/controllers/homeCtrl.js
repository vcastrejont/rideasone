angular.module('carPoolingApp').controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$rootScope','$scope', '$window', 'apiservice','mapFactory'];

function homeCtrl ($rootScope, $scope, $window, apiservice, mapFactory ) {
  $scope.parque = {lat:29.078235, lng:-110.946711}; 
  $scope.nearsoft = {lat:29.097443, lng:-111.022077};
  $scope.api = mapFactory.getApi();
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
