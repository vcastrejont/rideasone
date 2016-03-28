angular.module('carpoolingVan')

.controller('mapCtrl', function($scope, mapService) {

  mapService.initMap()
  .then(function() {
    mapService.addMarker(29.0617337,-110.9767597);
    mapService.addMarker(29.0689827,-110.9759557);
  });
});
