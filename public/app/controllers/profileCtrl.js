angular.module('carPoolingApp').controller('profileCtrl', profileCtrl);

profileCtrl.$inject = ['$scope','apiservice','mapFactory' ];

function profileCtrl ($scope, apiservice, mapFactory) {

  $scope.user=sessionservice.user();
  $scope.api = mapFactory.getApi();
  

}
