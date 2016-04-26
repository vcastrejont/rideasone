angular.module('carpoolingVan', ['ionic', 'firebase', 'ngCordova'])

.constant("firebaseRef", "https://blazing-heat-3837.firebaseio.com/")
.constant("clientId", "501324647645-0nt79uniegb99kmfgfhb84n7eao7dodv.apps.googleusercontent.com")
.constant("clientSecret", "tOdtnYK2ErrF_7GUrrAqR8bt")

.run(function($ionicPlatform, $rootScope, authFactory, $state) {
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
})

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
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
    url: '/users/:userId',
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
  })

  .state('van.passengers', {
    url: '/passengers/list',
    views: {
      'content': {
        templateUrl: 'templates/routes/passengers.html',
        controller: 'rideCtrl'
      }
    },
    params: {
      route: null,
      role: null
    }
  })

  .state('van.userList', {
    url: '/routes/addUser',
    views: {
      'content': {
        templateUrl: 'templates/routes/userList.html',
        controller: 'routesCtrl'
      }
    },
    params: {
      route: null
    }
  })

  .state('van.login', {
    url: '/login',
    views: {
      'content': {
        templateUrl: 'templates/login.html',
        controller: 'appCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('van/users');
});
