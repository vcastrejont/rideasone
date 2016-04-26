angular.module('carpoolingVan')

.controller('loginCtrl', loginCtrl);

function loginCtrl($scope, authFactory, $ionicHistory, $state) {
  
  $scope.isAuthenticated = authFactory.isAuthenticated;
  $scope.login = login;
  $scope.logout = logout;

  function login() {
    authFactory.login().then(function () {
      if(authFactory.isAuthenticated()) {
        $state.go("van.users");
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
      }
      else {
        reject();
      }
    }, reject);
  }

  function logout() {
    authFactory.logout();
    reject();
  }

  function reject() {
    $state.go("van.login");
  }
}
