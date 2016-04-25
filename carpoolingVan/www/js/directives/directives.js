angular.module('carpoolingVan')

.directive("toggleControl", function() {
  return {
    restrict: 'E',
    link: function(scope, elem, attr) {
      var templateUrl;

      if(scope.$parent.role == 'driver') {
        templateUrl = "templates/routes/checkinUserToggleTemplate.html";
      }
      else {
        templateUrl = "templates/routes/bypassUserToggleTemplate.html";
      }

      scope.contentUrl = templateUrl;
    },
    template: '<div ng-include="contentUrl"></div>'
  };
});
