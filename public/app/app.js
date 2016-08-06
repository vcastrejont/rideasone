var app = angular.module('carPoolingApp', [
  'geolocation',
  'mapService',
  'ui.bootstrap',
  'ui.router',
  'apiservice',
  'directive.g+signin',
  'ngStorage'
]);

app.run(['$rootScope', '$location', '$window',
  function($rootScope, $location, $window) {

    $rootScope.$on('$stateChangeSuccess',
      function(event) {
        if (!$window.ga) {
          return;
        }
        //console.log($location.path());
        $window.ga('send', 'pageview', {
          page: $location.path()
        });
      });
  }
]);

app.run(function($rootScope, $state, authservice, sessionservice, $localStorage, mapFactory) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (sessionservice.check()) {
      $rootScope.user = sessionservice.user();
    }else{
      if (toState.name!=='login'){
        event.preventDefault();
        $state.go('login');
      }
    }
  });
});


app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');
  var home = {
    name: 'home',
    url: '^/',
    templateUrl: "app/templates/index.html",
    templateUrl: "app/templates/home.html",
    controller: homeCtrl
  },
  getaride = {
    name: 'getaride',
    url: '^/getaride',
    templateUrl: "app/templates/getaride.html"
  },
  events = {
    name: 'events',
    url: '^/events',
    templateUrl: "app/templates/events.html",
    controller: eventsCtrl
  },
  eventShow = {
    name: 'eventshow',
    url: '^/event/show/:id',
    templateUrl: "app/templates/events.show.html",
    controller: eventsShowCtrl
  },
  eventsNew = {
    name: 'eventsnew',
    url: '^/events/new',
    templateUrl: "app/templates/events.new.html",
    controller: eventsNewCtrl
  },
  login = {
    name: 'login',
    url: '^/login',
    templateUrl: "app/templates/login.html",
    controller: loginCtrl
  },
  logout = {
    name: 'logout',
    url: '^/logout',
    templateUrl: "app/templates/login.html",
    controller: logoutCtrl
  },
  profile = {
    name: 'profile',
    url: '^/profile',
    templateUrl: "app/templates/profile.html",
    controller: profileCtrl
  };

  $stateProvider
  .state(home)
  .state(getaride)
  .state(events)
  .state(eventShow)
  .state(eventsNew)
  .state(login)
  .state(logout)
  .state(profile);
  
  $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
     return {
         'request': function (config) {
             config.headers = config.headers || {};
             if ($localStorage.token) {
                 config.headers.Authorization = 'JWT ' + $localStorage.token;
             }
             return config;
         },
         'responseError': function (response) {
             if (response.status === 401 || response.status === 403) {
                 $location.path('/login');
             }
             return $q.reject(response);
         }
     };
  }]);
  
  
});
