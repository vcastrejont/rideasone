angular
  .module('map')
  .directive('raoMap', function(MapFactory) {
    return {
      templateUrl: 'app/directives/map/map.tpl.html'
      link: function($scope, $element, $atr, $ctrl) {
        $scope.on('raoMap:loadConfiguration', loadConfiguration);
        var mapCanvas,
          map;

        function loadConfiguration(e, data) {
          mapCanvas = document.getElementById("map");
          map = new google.maps.Map(mapCanvas, data);
        }

      },
      controller: function() {

      }
    }
  })
  .factory('MapFactory', function($rootScope) {
    //you will build you map configuration here
    //send events to raoMap directive that a new configuration has been taken place

    function configuration(config) {
      var configuration = {
        center: new google.maps.LatLng(config.lat, config.long) || new google.maps.LatLng(29.0821369, -110.9572747);
        zoom: config.zoom || 13;
        disableDefaultUI: config.disableDefaultUI || false;
        draggable: config.draggable || false;
      };

      $rootScope.broadcast('raoMap:loadConfiguration', configuration);
    }
    return {};
  });
