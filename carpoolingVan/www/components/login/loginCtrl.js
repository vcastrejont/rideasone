angular.module('carpoolingVan')

.controller('loginCtrl', loginCtrl);

function loginCtrl($scope, authFactory, $ionicHistory, $state) {
  $scope.login = login;
  $scope.logout = logout;
  $scope.isAuthenticated = authFactory.isAuthenticated;
  $scope.isDriver = isDriver;

  function login() {
    authFactory.login().then(function (user) {
      $scope.user = user;
      if(authFactory.isAuthenticated()) {
        $state.go("van.routes");

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

  function isDriver() {
    return authFactory.currentUser().driver;
  }
}
