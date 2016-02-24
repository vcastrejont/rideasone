var app = angular.module('carPoolingApp', [
  'geolocation',
  'mapService',
  'ui.bootstrap',
  'ui.router'
]);


app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state("home", {
      url: "/",
      templateUrl: "app/templates/index.html"
    })
    .state('myroutes', {
      url: "/myroutes",
      templateUrl: "app/templates/myroutes.html"
    })
    .state('myroutes.list', {
      url: "/list",
      templateUrl: "app/templates/myroutes-list.html",
      controller: function($scope) {
        $scope.items = ["A", "List", "Of", "Items"];
      }
    })
    .state('getaride', {
      url: "/getaride",
      templateUrl: "app/templates/getaride.html"
    })
    .state('events', {
      url: "/events",
      templateUrl: "app/templates/events.html"
    })
    .state('settings', {
      url: "/settings",
      templateUrl: "app/templates/settings.html",
      controller: settingsCtrl
    })

});
