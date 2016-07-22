angular.module('carPoolingApp').controller('loginCtrl', loginCtrl);
loginCtrl.$inject = ['$scope','$auth' ];

function loginCtrl ($scope, $auth) {
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider);
    };
};
