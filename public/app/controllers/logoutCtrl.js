angular.module('carPoolingApp').controller('logoutCtrl', logoutCtrl);

logoutCtrl.$inject = ['$scope','authservice','sessionservice','$state'];

  function logoutCtrl ($scope, authservice, sessionservice, $state) {
    sessionservice.clear();
    
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    
    $state.go('login');

  
};
