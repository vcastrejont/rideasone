angular.module('carPoolingApp').directive('mapcanvas', function(mapFactory) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div></div>',
    link: function(scope, element, attrs) {
        var myOptions = {
          zoom: 13,
          center: new google.maps.LatLng(46.87916, -3.32910),
          disableDefaultUI: true,
          draggable: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var defaultPos;
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var map = new google.maps.Map(document.getElementById(attrs.id), myOptions);
        directionsDisplay.setMap(map);

        mapFactory.setApi({

          defaultLocation: function(zoom) {
            zoom = zoom || 13;
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
            var searchInput = document.getElementById(inputField);
            var autocomplete = new google.maps.places.Autocomplete(searchInput);
            var address = '';
            autocomplete.bindTo('bounds', map);
            autocomplete.addListener('place_changed', fillInAddress);

            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
              map: map,
              anchorPoint: new google.maps.Point(0, -29)
            });

            function fillInAddress() {
              var place = autocomplete.getPlace();
              console.log(place.formatted_address);
              console.log(place.place_id);
              console.log(place.geometry.location.lat());
              console.log(place.geometry.location.lng());
              console.log(place.name);
            }
            autocomplete.addListener('place_changed', function() {
              infowindow.close();
              marker.setVisible(false);
              var place = autocomplete.getPlace();
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

        }); //setApi
      } // link
  }; // return
});
