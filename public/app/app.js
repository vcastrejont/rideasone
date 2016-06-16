var app = angular.module('carPoolingApp', [
  'geolocation',
  'mapService',
  'ui.bootstrap',
  'ui.router',
  'apiservice'
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

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  var home = {
    name: 'home',
    url: '^/',
    templateUrl: "app/templates/index.html",
    templateUrl: "app/templates/home.html",
    controller: homeCtrl
  },
  setdefault = {
    name: 'setdefault',
    url: '^/setdefault',
    templateUrl: "app/templates/setdefault.html",
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
  };

  $stateProvider
  .state(home)
  .state(getaride)
  .state(events)
  .state(eventShow)
  .state(eventsNew)
  .state(setdefault);
  
});
