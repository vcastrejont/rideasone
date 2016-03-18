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
        templateUrl: 'templates/users.html',
        controller: 'usersCtrl'
      }
      // 'map': {
      //   templateUrl: 'templates/map.html',
      //   controller: 'mapCtrl'
      // }
    }
  })

  .state('van.routes', {
    url: '/routes',
    views: {
      'content': {
        templateUrl: 'templates/routes.html',
        controller: 'routesCtrl'
      }
    }
  })

  .state('van.rides', {
    url: '/rides',
    views: {
      'content': {
        templateUrl: 'templates/rides.html',
        controller: 'ridesCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('van/routes');
});
