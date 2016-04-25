angular.module('carpoolingVan')

.controller('appCtrl', appCtrl);

function appCtrl($scope, authFactory, $ionicHistory, $state) {
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
        $state.go('van.login');
      }
    },
    function(error) {
      $state.go('van.login');
    });
  }

  function logout() {
    authFactory.logout();
    $state.go("van.login");
  }
}
