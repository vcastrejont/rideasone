angular.module('carpoolingVan')

.factory('mapService', function($cordovaGeolocation) {

  var bounds, map, options = {timeout: 10000, enableHighAccuracy: true};

  return {
    initMap: initMap,
    addMarker: addMarker,
    createEmptyMarker: createEmptyMarker
  };

  function initMap(location) {
    var latLng, mapOptions;

    // var location = {
    //   lat: 29.0976337,
    //   lng: -111.0217114
    // };

    if(location && location.lat && location.lng) {
      latLng = new google.maps.LatLng(location.lat, location.lng);

      bounds = new google.maps.LatLngBounds();
      bounds.extend(latLng);

      mapOptions = {
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      console.log(document.getElementById("map"));
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      // console.log(map);
      return map;
    }
    else {
      return $cordovaGeolocation.getCurrentPosition(options)
      .then(function(position) {

        latLng = new google.maps.LatLng(position.coords.latitude,
          position.coords.longitude);

        bounds = new google.maps.LatLngBounds();
        bounds.extend(latLng);

        mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        console.log(document.getElementById("map"));
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        // console.log(map);
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

  function createEmptyMarker() {
    return new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP
    });
  }

  // function hideMarker(marker) {
  //
  //   marker.setVisible(false);
  // }
});
