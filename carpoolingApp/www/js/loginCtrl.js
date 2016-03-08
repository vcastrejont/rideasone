angular.module('carpooling.controllers')

// .controller('LoginCtrl', function($scope, $cordovaInAppBrowser, $rootScope) {
.controller('LoginCtrl', function($scope, $cordovaOauth) {
    var callbackURI = "http://localhost:3000/auth/google/callback",
        backendRoute = "http://localhost:3000/#/";

    $scope.login = function() {
      $cordovaOauth.google(clientId, ["email", "profile"]).then(function(result) {
          console.log("Response Object -> " + JSON.stringify(result));
      }, function(error) {
          console.log("Error -> " + error);
      });

        // var ref = $cordovaInAppBrowser.open(
        //   'https://accounts.google.com/o/oauth2/auth?client_id=' + clientId +
        //   '&redirect_uri=' + callbackURI +
        //   '&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile' +
        //   '&approval_prompt=force&response_type=code&access_type=offline',
        //   '_system');
        //
        // $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event) {
        //   if(event.url === backendRoute) {
        //       $cordovaInAppBrowser.close();
        //   }
        // });
        //
        // $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event) {
        //   $location.path("/");
        // });
    };
});
