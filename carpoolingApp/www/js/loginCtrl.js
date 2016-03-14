angular.module('carpooling.controllers')

.controller('LoginCtrl', function($scope, $location, AuthService) {
    // $scope.login = function() {
    //   AuthService.login()
    //   .then(function (user) {
    //     var route = "/";
    //
    //     $scope.setCurrentUser(user);
    //
    //     // if(UserService.existsOrSave(user)) {
    //     //   route = "/";
    //     // }
    //     // else {
    //     //   route = "/login";
    //     // }
    //
    //     $location.path(route);
    //
    //   }, function (err) {
    //     alert("failed" + err);
    //   });
    // };
});
