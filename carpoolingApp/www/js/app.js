angular.module('carpooling', ['ionic', 'ngCordova', 'ngCordovaOauth', 'carpooling.controllers', 'carpooling.data'])

.constant("clientId", "764821343773-cjpf8lnubnnmjrupiu8oen4vsacgcq9n.apps.googleusercontent.com")
.constant("clientSecret", "5sAsJshpCHf_s4Tzk17_7nTK")

.factory('AuthService', function (clientId, $cordovaOauth, ProfileAPIService) {
  var authService = {};

  authService.login = function() {
    return $cordovaOauth.google(clientId, ["email", "profile"])
    .then(function(response) {
        if(response !== undefined && response.access_token !== undefined) {
          return ProfileAPIService.getProfile(response.access_token);
        }
    }, function(error) {
        alert("Error -> " + error);
    });
  };

  authService.isAuthenticated = function() {
    return !!Session.userId;
  };

  return authService;
})

.factory('ProfileAPIService', function ($http, Session) {
  var profileAPIService = {};

  profileAPIService.getProfile = function(accessToken) {
    var url = 'https://www.googleapis.com/plus/v1/people/me?access_token=' + accessToken;

    return $http.get(url)
    .then(function(response) {
      Session.create(response.data.id, response.data.displayName, response.data.emails[0].value);
      return Session.get();
    },
    function(error) {
      return null;
    });
  };

  return profileAPIService;
})

.factory('UserService', function ($http, Session) {
  var profileAPIService = {};

  profileAPIService.getProfile = function(accessToken) {
    var url = 'https://www.googleapis.com/plus/v1/people/me?access_token=' + accessToken;

    return $http.get(url)
    .then(function(response) {
      Session.create(response.data.id,
        response.data.displayName,
        response.data.emails[0].value,
        response.data.imageUrl
      );

      return Session.get();
    },
    function(error) {
      return null;
    });
  };

  return profileAPIService;
})

.service('Session', function () {
  this.create = function (userId, userName, userEmail, userImage) {
    this.userId = userId;
    this.userName = userName;
    this.userEmail = userEmail;
    this.userImage = userImage;
  };

  this.get = function () {
    return {
      userId: this.userId,
      userName: this.userName,
      userEmail: this.userEmail,
      userImage: this.userImage
    }
  };

  this.destroy = function () {
    this.userId = null;
    this.userName = null;
    this.userEmail = null;
    this.userImage = null;
  };
})

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
  });
})

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
          controller: 'EventsCtrl'
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
            templateUrl: 'templates/auth.html',
            controller: 'LoginCtrl'
          }
        }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/map');
});
