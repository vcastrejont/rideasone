angular.module('carpoolingVan')

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);

  $stateProvider

  .state('van', {
    url: '/van',
    abstract: true,
    templateUrl: 'layout.html',
    controller: 'loginCtrl'
  })

  .state('van.users', {
    url: '/users',
    views: {
      'content': {
        templateUrl: 'components/users/users.html',
        controller: 'usersCtrl'
      }
    }
  })

  .state('van.profile', {
    url: '/profile',
    views: {
      'content': {
        templateUrl: 'components/users/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('van.routes', {
    url: '/routes',
    views: {
      'content': {
        templateUrl: 'components/routes/routes.html',
        controller: 'routesCtrl'
      }
    }
  })

  .state('van.passengers', {
    url: '/passengers',
    views: {
      'content': {
        templateUrl: 'components/routes/passengers.html',
        controller: 'rideCtrl'
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
        templateUrl: 'components/login/login.html',
        controller: 'loginCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('van/users');
});
