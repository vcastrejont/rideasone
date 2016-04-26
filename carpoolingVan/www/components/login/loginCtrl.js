angular.module('carpoolingVan')

.controller('loginCtrl', loginCtrl);

function loginCtrl($scope, authFactory, $ionicHistory, $state) {

  $scope.isAuthenticated = authFactory.isAuthenticated;
  $scope.login = login;
  $scope.logout = logout;
  $scope.isDriver = isDriver;

  function login() {
    var state;

    authFactory.login().then(function (user) {
      if(authFactory.isAuthenticated()) {
        state = user.driver ? "van.driverRoutes" : "van.userRoutes";
        $state.go(state);

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
    var currentUser = authFactory.currentUser();
    return currentUser ? currentUser.driver : false;
  }
}
