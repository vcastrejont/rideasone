angular.module('carpooling', [
  'ionic',
  'ngCordova',
  'ngCordovaOauth',
  'carpooling.controllers',
  'carpooling.services',
  'carpooling.directives',
  'carpooling.data',
  'ngSanitize',
  'btford.socket-io'
])

.constant("clientId", "764821343773-cjpf8lnubnnmjrupiu8oen4vsacgcq9n.apps.googleusercontent.com")
.constant("clientSecret", "5sAsJshpCHf_s4Tzk17_7nTK")


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // $rootScope.$on( '$stateChangeStart', function(e, to, toParams, from, fromParams) {
    //   if(!$scope.isAuthenticated) {
    //     console.log('$stateChangeStart: ', to);
    //
    //     // if (!authorized) {
    //     //   console.log('$stateChangeStart: ', authorized);
    //     //   // User is not permitted into this area
    //     //   // Kick back to login
    //     //   e.preventDefault();
    //     //   $state.go('home.default', {}, { notify: true });
    //     // }
    //   }
    //
    //   $rootScope.$broadcast('AppController::startLoad', {to: to, from: from});
    //
    // });
    //
    // $rootScope.$on( '$stateChangeError', function(e, to, toParams, from, fromParams) {});
    // $rootScope.$on( '$stateChangeSuccess', function(e, to, toParams, from, fromParams) {});
  });
})

.constant("apiUrl", "http://localhost:3001/api/")

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })

    .state('app.routes', {
      url: '/my-routes',
      views: {
        'menuContent': {
          templateUrl: 'templates/routes.html',
          controller: 'RoutesCtrl'
        }
      }
    })

    .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html'
        }
      }
    })

    .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html',
          controller: 'MapCtrl'
        }
      }
    })

    .state('app.events', {
      url: '/events',
      views: {
        'menuContent': {
          templateUrl: 'templates/events.html',
          controller: 'eventsCtrl'
        }
      }
    })

    .state('app.event', {
      url: '/events/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/event.html',
          controller: 'EventCtrl'
        }
      }
    })

    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })

    .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/auth.html'
          }
        }
    })

    .state('app.chat', {
      url: '/chat/:eventId',
      views: {
        'menuContent': {
          templateUrl: "templates/chat.html",
          controller: 'ChatCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
