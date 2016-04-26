angular.module('carpoolingVan')

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
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

  .state('van.userProfile', {
    url: '/users/:userId',
    views: {
      'content': {
        templateUrl: 'components/users/profile.html',
        controller: 'userCtrl'
      }
    }
  })

  .state('van.userRoutes', {
    url: '/user/routes',
    views: {
      'content': {
        templateUrl: 'components/routes/userRoutes.html',
        controller: 'routesCtrl'
      }
    }
  })

  .state('van.driverRoutes', {
    url: '/driver/routes',
    views: {
      'content': {
        templateUrl: 'components/routes/driverRoutes.html',
        controller: 'routesCtrl'
      }
    }
  })

  .state('van.passengers', {
    url: '/passengers/list',
    views: {
      'content': {
        templateUrl: 'components/routes/passengers.html',
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
        templateUrl: 'components/routes/userList.html',
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
        templateUrl: 'components/login/login.html',
        controller: 'loginCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('van/users');
});
