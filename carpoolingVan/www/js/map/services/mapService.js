angular.module('carpoolingVan')

.factory('mapService', function($cordovaGeolocation) {

  var map, bounds;

  return {
    initMap: initMap,
    addMarker: addMarker
  };

  function initMap(location) {
    var latLng,
      mapOptions,
      options = {
        timeout: 10000,
        enableHighAccuracy: true
      };

    if(location && location.lat && location.lng) {
      latLng = new google.maps.LatLng(location.lat, location.lng);

      bounds = new google.maps.LatLngBounds();
      bounds.extend(latLng);

      mapOptions = {
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      return map;
    }
    else {

      return $cordovaGeolocation.getCurrentPosition(options)
      .then(function(position) {

        latLng = new google.maps.LatLng(position.coords.latitude,
          position.coords.longitude);

        bounds = new google.maps.LatLngBounds();

        mapOptions = {
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

    var loc = new google.maps.LatLng(lat, lng),
    marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: loc
    });

    bounds.extend(loc);

    map.fitBounds(bounds);
    map.panToBounds(bounds);

    return marker;
  }
});
