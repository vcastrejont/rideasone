angular.module('carpoolingVan')

.directive("toggleControl", function() {
  return {
    restrict: 'E',
    link: function(scope, elem, attr) {
      var templateUrl;

      if(scope.$parent.role == 'driver') {
        templateUrl = "components/routes/checkinUserToggleTemplate.html";
      }
      else {
        templateUrl = "components/routes/bypassUserToggleTemplate.html";
      }

      scope.contentUrl = templateUrl;
    },
    template: '<div ng-include="contentUrl"></div>'
  };
});
