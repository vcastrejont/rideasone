angular.module('carpoolingVan', [
  'ionic',
  'firebase',
  'ngCordova',
  'btford.socket-io'
])

.run(function($ionicPlatform, $rootScope, authFactory, $state) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$stateChangeStart', function (event, next) {
    if (!authFactory.isAuthenticated()) {
      authFactory.logout();

      if (next.name !== 'van.login') {
        event.preventDefault();
        $state.go('van.login');
      }
    }
    else if (next.name === 'van.login') {
      authFactory.logout();
    }
  });
});
