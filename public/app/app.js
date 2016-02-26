var app = angular.module('carPoolingApp', [
  'geolocation',
  'mapService',
  'ui.bootstrap',
  'ui.router'
]);


app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  var home = {
    name: 'home',
    url: '^/',
    templateUrl: "app/templates/index.html"
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
  eventsNew = {
    name: 'events-new',
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
  .state(myroutes)
  .state(getaride)
  .state(events)
  .state(eventsNew)
  .state(settings);
});
