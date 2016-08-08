angular.module('carPoolingApp').factory('mapFactory', function($rootScope) {
  var api = {},
    currentEventLocation,
    mapFactory;

  mapFactory = {

    api: {},

    autocomplete: null,

    setApi: function(_api) {
      api = _api;
      this.success();
    },

    getApi: function() {
      return api;
    },

    setApiMeth: function(meth) {
      return false;
    },

    success: function() {
      //console.log("factory success!");
      $rootScope.$broadcast('mapFactory:success');
    },

    setEventLocationData: function() {
      var place = mapFactory.autocomplete.getPlace();

      currentEventLocation = {
        address: place.formatted_address,
        google_places_id: place.google_places_id,
        place_id: place.place_id,
        location: {
          lat: place.geometry.location.lat(),
          lon: place.geometry.location.lng()
        }
      };
    },

    getEventLocationData: function() {
      return currentEventLocation;
    },

    build: function(directionsService, directionsDisplay, map) {
      return {
        defaultLocation: function() {
          defaultPos = {
            lat: 12.4650114,
            lng:  -34.1544719
          };
          map.setCenter(defaultPos);
          map.setZoom(3);
        },
        
        currentLocation: function(zoom) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              defaultPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              map.setCenter(defaultPos);
              map.setZoom(zoom);
              console.log("Auto geolocation success");
            }, function() {
              console.log("Auto geolocation failed");
            });
          }
        },
        
        addMarker: function(pos) {
          var latLng = new google.maps.LatLng(pos.lat, pos.lng);
          var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: "Hello World!"
          });

          if (typeof pos.zoom !== 'undefined') {
            map.setZoom(map.zoom);
          }
          if (pos.center === true) {
            map.setCenter(latLng);
          }
        },

        showRoute: function(origin, destination) {
          directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
          }, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setOptions({
                preserveViewport: true,
                draggable: true,
                hideRouteList: true,
                suppressMarkers: true
              });
              directionsDisplay.setDirections(response);
              //polylineOptions:{strokeColor:"#2EBFD9",strokeWeight:2}
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        },

        placesAutocomplete: function(inputField) {
          var searchInput = document.getElementById(inputField),
            address = '';

          mapFactory.autocomplete = new google.maps.places.Autocomplete(searchInput);

          mapFactory.autocomplete.bindTo('bounds', map);
          mapFactory.autocomplete.addListener('place_changed', mapFactory.setEventLocationData);

          var infowindow = new google.maps.InfoWindow();
          var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
          });

          mapFactory.autocomplete.addListener('place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = mapFactory.autocomplete.getPlace();
            if (!place.geometry) {
              window.alert("Autocomplete's returned place contains no geometry");
              return;
            }


            if (place.geometry.viewport) {
              map.fitBounds(place.geometry.viewport);
            } else {
              map.setCenter(place.geometry.location);
              map.setZoom(17);
            }
            marker.setIcon( /** @type {google.maps.Icon} */ ({
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);


            if (place.address_components) {
              address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
              ].join(' ');
            }
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);
          });
          return address;
        }
      };
    },
  };

  return mapFactory;
});
