angular.module('carpooling.controllers')

.controller('AppCtrl', AppCtrl);

AppCtrl.$inject = [
  "$scope", "AuthService", "$location", "$rootScope", "$state", "ProfileAPIService"
];

function AppCtrl($scope, AuthService, $location, $rootScope, $state, ProfileAPIService) {

  $scope.isAuthenticated = false;

  $scope.login = function() {
    AuthService.login()
    .then(function (response) {
      if(response !== undefined && response.access_token !== undefined) {
        ProfileAPIService.getProfile(response.access_token)
        .then(function(user) {
            var state = "app.map";
            // if(UserService.existsOrSave(user)) {
            //   route = "app/events";
            // }
            // else {
            //   route = "app/login";
            // }

            setCurrentUser(user);
            $state.go(state);
        },
        function(error) {
          alert(error);
        });
      }
    },
    function(error) {
      alert(error);
    });
  };

  $scope.logout = function() {
    userFakeInit();
    $state.go("app.login");
  };

  function userInit() {
    $scope.currentUser = null;
    $scope.isAuthenticated = false;
  }

  function setCurrentUser(user) {
    if(user !== undefined) {
      $scope.currentUser = user;
      $scope.isAuthenticated = true;
    }
  }

  function userFakeInit() {
    $scope.currentUser = {
      id: "214654643134567",
      name: "Rafa",
      email: "manrique@gmail.com",
      image: "/img/bird.png"
    };
    $scope.isAuthenticated = true;
  }

  // userInit();
  userFakeInit();

}
