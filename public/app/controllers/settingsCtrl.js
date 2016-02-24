angular.module('carPoolingApp').controller('settingsCtrl', settingsCtrl);

settingsCtrl.$inject = ['$scope', '$http'];

function settingsCtrl ($scope, $http) {
  
  $scope.settings = {};

    $http.get('/api/settings')
        .success(function(data) {
            $scope.settings = data;
        })
        .error(function(data) {
            console.error('Error: ' + data);
        });
        
    
      $scope.saveData = function() {
        $http.post('/api/settings', $scope.settings)
        .success(function(res, status) {
          if(res.ok)
             $scope.apiSuccess = true;
        })
        .error(function(data) {
            console.error('Error: ' + data);
        });
      };
}
