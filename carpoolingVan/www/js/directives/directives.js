angular.module('carpoolingVan')

.directive("addButton", function() {
  return {
    templateUrl: "templates/addButtonTemplate.html"
  }
})

.directive("modalToggleControl", function() {
  return {
    restrict: 'E',
    link: function(scope, elem, attr) {
      var templateUrl;

      if(scope.$parent.role == 'driver') {
        templateUrl = "templates/routes/checkinUserToggleTemplate.html"
      }
      else {
        templateUrl = "templates/routes/bypassUserToggleTemplate.html"
      }

      scope.contentUrl = templateUrl;
    },
    template: '<div ng-include="contentUrl"></div>'
  }
})

.directive("modalTitle", function() {
  return {
    template: '{{route.time}} passenger {{role == "driver" ? "check in" : "tracking"}}',
    controller: 'usersCtrl'
  }
});
