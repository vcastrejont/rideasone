angular.module('carpoolingVan', ['ionic', 'firebase', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.constant("firebaseRef", "https://blazing-heat-3837.firebaseio.com/")

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('van', {
    url: '/van',
    abstract: true,
    templateUrl: 'templates/layout.html',
    controller: 'appCtrl'
  })

  .state('van.users', {
    url: '/users',
    views: {
      'content': {
        templateUrl: 'templates/users/users.html',
        controller: 'usersCtrl'
      }
    }
  })

  .state('van.userProfile', {
    url: '/users/profile/:userId',
    views: {
      'content': {
        templateUrl: 'templates/users/profile.html',
        controller: 'userCtrl'
      }
    }
  })

  .state('van.userRoutes', {
    url: '/user/routes',
    views: {
      'content': {
        templateUrl: 'templates/routes/userRoutes.html',
        controller: 'routesCtrl'
      }
    }
  })

  .state('van.driverRoutes', {
    url: '/driver/routes',
    views: {
      'content': {
        templateUrl: 'templates/routes/driverRoutes.html',
        controller: 'routesCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('van/user/routes');
});
