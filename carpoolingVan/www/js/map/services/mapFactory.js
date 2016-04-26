angular.module('carpoolingVan')

.factory('mapFactory', function($cordovaGeolocation, $filter) {
  var map,
  markers = [];

  return {
    drawMap: drawMap,
    calculateDistance: calculateDistance,
    getGeolocation: getGeolocation,
    addMarker: addMarker,
    setMarkers: setMarkers
  };

  function drawMap() {
    clearMarkers();

    return getGeolocation(true).then(function(position) {
      if(!position) return;

      map = new google.maps.Map(document.getElementById("map"), {
        center: position,
        zoom: 15
      });

      return map;
    }, function(err) {
      return err;
    });
  }

  function getGeolocation(latLngF) {
    var latLngFormat = latLngF || false;

    return $cordovaGeolocation.getCurrentPosition({
      timeout: 10000, enableHighAccuracy: false
    })
    .then(function(position) {
      var pos = position.coords;
      if(!pos.latitude || !pos.longitude) return;

      if(latLngFormat) {
        return new google.maps.LatLng(pos.latitude, pos.longitude);
      }
      else {
        return pos;
      }
    }, function(err) {
      return "Unable to get geolocation:" + err;
    });
  }

  // Adds a marker to the map and push to the array.
  function addMarker(latLng, markerIcon, info) {
    var markerOptions = {
      position: latLng,
      map: map
    };

    if(markerIcon) {
      markerOptions.icon = markerIcon;
    }

    if(map) {
      var marker = new google.maps.Marker(markerOptions);

      calculateDistance(latLng).then(function(distance) {
        createInfoWindow(info + '<br>Distance: ' + $filter("number")(distance / 1000, 2) + " km", marker);
      }, function() {
        createInfoWindow(info + '<br>Unable to compute distance', marker);
      });

      markers.push(marker);
      return marker;
    }
  }

  function createInfoWindow(content, marker) {
    if(marker) {
      var infoWindow = new google.maps.InfoWindow({
        content: content
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
      });
    }
  }

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

  function setMarkers(newMarkers) {
    var bounds = new google.maps.LatLngBounds(),
    pos;

    clearMarkers();

    angular.forEach(newMarkers, function(marker) {
      if(marker.location && marker.location.latitude && marker.location.longitude) {
        pos = new google.maps.LatLng(marker.location.latitude,
          marker.location.longitude);

        addMarker(pos, marker.icon, marker.info);

        bounds.extend(pos);
        map.fitBounds(bounds);
        map.panToBounds(bounds);
      }
    });

    return markers;
  }

  function calculateDistance(pointA) {
    return getGeolocation(true).then(function(pointB) {
      return google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);
    });
  }
});
