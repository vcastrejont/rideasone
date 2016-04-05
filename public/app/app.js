var app = angular.module('carPoolingApp', [
  'geolocation',
  'mapService',
  'ui.bootstrap',
  'ui.router'
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
    templateUrl: "app/templates/mycarpooling.html",
    controller: myCarpoolingCtrl
  },
  mycarpooling = {
    name: 'mycarpooling',
    url: '/mycarpooling',
    templateUrl: "app/templates/mycarpooling.html"  ,
    controller: myCarpoolingCtrl
  },
  myroutes = {
    name: 'myroutes',
    url: '/myroutes',
    templateUrl: "app/templates/myroutes.html"
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
  settings = {
    name: 'settings',
    url: "/settings",
    templateUrl: 'app/templates/settings.html',
    controller: settingsCtrl
  };

  $stateProvider
  .state(home)
  .state(mycarpooling)
  .state(myroutes)
  .state(getaride)
  .state(events)
  .state(eventShow)
  .state(eventsNew)
  .state(settings);
});
