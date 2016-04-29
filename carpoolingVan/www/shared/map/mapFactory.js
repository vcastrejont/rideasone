angular.module('carpoolingVan')

.factory('mapFactory', function($cordovaGeolocation, $filter) {
  var map,
  markers = [],
  bounds;

  return {
    drawMap: drawMap,
    drawAutocompleteMap: drawAutocompleteMap,
    getGeolocation: getGeolocation,
    addMarker: addMarker,
    clearMarker: clearMarker,
    setMarkers: setMarkers,
    extendBounds: extendBounds
  };

  function drawMap() {
    clearMarkers();

    return getGeolocation(true).then(function(position) {
      if(!position || !document.getElementById("map")) return;

      map = new google.maps.Map(document.getElementById("map"), {
        center: position,
        zoom: 15
      });

      return map;
    }, function(err) {
      return err;
    });
  }

  function drawAutocompleteMap(loc, scope) {
    $scope = scope;

    return drawMap().then(function(map) {
      var marker,
      bounds,
      searchInput = document.getElementById('autocomplete');
      autocomplete = new google.maps.places.Autocomplete(searchInput);

      if(loc) {
        marker = addMarker({
          latitude: loc.lat,
          longitude: loc.lng
        });

        bounds = new google.maps.LatLngBounds(new google.maps.LatLng(loc.lat, loc.lng));
        map.fitBounds(bounds);
        map.panToBounds(bounds);
      }

      autocomplete.bindTo('bounds', map);

      autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace(),
        lat = place.geometry.location.lat(),
        lng = place.geometry.location.lng();

        if(marker) {
          clearMarker(marker);
        }

        marker = addMarker({
          latitude: lat,
          longitude: lng
        });
        
        var bounds = new google.maps.LatLngBounds(new google.maps.LatLng(lat, lng));
        map.fitBounds(bounds);
        map.panToBounds(bounds);

        $scope.$emit('mapFactory::updatePosition', place);
      });
      return map;
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
  function addMarker(location, markerIcon, info) {
    if(map && location.latitude && location.longitude) {
      var latLng = new google.maps.LatLng(location.latitude, location.longitude),
      markerOptions = {
        position: latLng,
        map: map
      };

      if(markerIcon) {
        markerOptions.icon = markerIcon;
      }

      if(!info) {
        info = "";
      }

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

  function clearMarker(marker) {
    marker.setMap(null);
  }

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      clearMarker(markers[i]);
    }
    bounds = new google.maps.LatLngBounds();
    markers = [];
  }

  function setMarkers(passengers) {
    var marker;
    clearMarkers();

    angular.forEach(passengers, function(p) {
      if(p.info && p.info.location && p.info.location.lat && p.info.location.lng &&
      !p.bypass) {
        marker = {
          location: {
            latitude: p.info.location.lat,
            longitude: p.info.location.lng
          },
          icon: p.info.image + "?sz=30",
          info: p.info.name + "<br>" + p.info.location.address
        };

        addMarker(marker.location, marker.icon, marker.info);
        bounds.extend(new google.maps.LatLng(p.info.location.lat, p.info.location.lng));
      }
    });

    if(map) {
      map.fitBounds(bounds);
      map.panToBounds(bounds);
    }

    return markers;
  }

  function calculateDistance(pointA) {
    return getGeolocation(true).then(function(pointB) {
      return google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);
    });
  }

  function extendBounds(latLng) {
    if(map) {
      if(!bounds) {
        bounds = google.maps.LatLngBounds();
      }

      bounds.extend(latLng);
      map.fitBounds(bounds);
      map.panToBounds(bounds);
    }
  }
});
