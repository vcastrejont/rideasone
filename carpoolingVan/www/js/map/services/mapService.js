angular.module('carpoolingVan')

.factory('mapService', function($cordovaGeolocation) {

  var map;
  var bounds;
  // var autocomplete;

  return {
    initMap: initMap,
    addMarker: addMarker
  };

  function initMap(location) {

    if(location && location.lat && location.lng) {
      var latLng = new google.maps.LatLng(location.lat, location.lng);

      bounds = new google.maps.LatLngBounds();
      bounds.extend(latLng);

      var mapOptions = {
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      return map;
    }
    else {
      var options = {timeout: 10000, enableHighAccuracy: true};

      return $cordovaGeolocation.getCurrentPosition(options)
      .then(function(position) {

        var latLng = new google.maps.LatLng(position.coords.latitude,
          position.coords.longitude);

        bounds = new google.maps.LatLngBounds();

        var mapOptions = {
          center: latLng,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        return map;
      },
      function(error) {
        console.log(JSON.stringify(error));
      });
    }
  }

  function addMarker(lat, lng) {

    var loc;
    //Wait until the map is loaded

    loc = new google.maps.LatLng(lat, lng);
    bounds.extend(loc);

    var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: loc
    });

    map.fitBounds(bounds);
    map.panToBounds(bounds);

    return marker;
  }
});
