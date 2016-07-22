var app = angular.module('carPoolingApp', [
  'geolocation',
  'mapService',
  'ui.bootstrap',
  'ui.router',
  'apiservice',
  'satellizer'
]);

app.run(['$rootScope', '$location', '$window',
  function($rootScope, $location, $window) {

    $rootScope.$on('$stateChangeSuccess',
      function(event) {
        if (!$window.ga) {
          return;
        }
        console.log($location.path());
        $window.ga('send', 'pageview', {
          page: $location.path()
        });
      });
  }
]);

// app.config(function($authProvider) {
//   $authProvider.google({
//     clientId: '764821343773-cjpf8lnubnnmjrupiu8oen4vsacgcq9n.apps.googleusercontent.com'
//   });
// });

app.config(function($stateProvider, $urlRouterProvider, $authProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        controller: 'homeCtrl',
        templateUrl: "app/templates/home.html"
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/templates/login.html',
        controller: 'loginCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      });

    $urlRouterProvider.otherwise('/');

    $authProvider.facebook({
      clientId: '657854390977827'
    });

    $authProvider.google({
      clientId: '764821343773-cjpf8lnubnnmjrupiu8oen4vsacgcq9n.apps.googleusercontent.com'
    });

    $authProvider.github({
      clientId: '0ba2600b1dbdb756688b'
    });

    $authProvider.linkedin({
      clientId: '77cw786yignpzj'
    });

    $authProvider.instagram({
      clientId: '799d1f8ea0e44ac8b70e7f18fcacedd1'
    });

    $authProvider.yahoo({
      clientId: 'dj0yJmk9OWtXdlJzQ05aZlVwJmQ9WVdrOU0yWjVZa2hJTm0wbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1jYw--'
    });

    $authProvider.twitter({
      url: '/auth/twitter'
    });

    $authProvider.live({
      clientId: '000000004C12E68D'
    });

    $authProvider.twitch({
      clientId: 'qhc3lft06xipnmndydcr3wau939a20z'
    });

    $authProvider.bitbucket({
      clientId: '7jVUGppM2YabSdbdx8'
    });

    $authProvider.oauth2({
      name: 'foursquare',
      url: '/auth/foursquare',
      clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
      redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
      authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
    });

    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }
});

// 
// app.config(function($stateProvider, $urlRouterProvider) {
//   $urlRouterProvider.otherwise('/');
//   var home = {
//     name: 'home',
//     url: '^/',
//     templateUrl: "app/templates/index.html",
//     templateUrl: "app/templates/home.html",
//     controller: homeCtrl
//   },
//   setdefault = {
//     name: 'setdefault',
//     url: '^/setdefault',
//     templateUrl: "app/templates/setdefault.html",
//     controller: homeCtrl
//   },
//   getaride = {
//     name: 'getaride',
//     url: '^/getaride',
//     templateUrl: "app/templates/getaride.html"
//   },
//   events = {
//     name: 'events',
//     url: '^/events',
//     templateUrl: "app/templates/events.html",
//     controller: eventsCtrl
//   },
//   eventShow = {
//     name: 'eventshow',
//     url: '^/event/show/:id',
//     templateUrl: "app/templates/events.show.html",
//     controller: eventsShowCtrl
//   },
//   eventsNew = {
//     name: 'eventsnew',
//     url: '^/events/new',
//     templateUrl: "app/templates/events.new.html",
//     controller: eventsNewCtrl
//   };
// 
//   $stateProvider
//   .state(home)
//   .state(getaride)
//   .state(events)
//   .state(eventShow)
//   .state(eventsNew)
//   .state(setdefault);
//   
// });
