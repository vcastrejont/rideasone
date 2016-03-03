angular.module('carPoolingApp').controller('eventsNewCtrl', eventsNewCtrl);

eventsNewCtrl.$inject = ['$scope', '$http', 'mapService',  '$state' ];

function eventsNewCtrl ($scope, $http, mapService, $state) {
  $scope.location = {};
  $scope.event = {
    date: new Date()
  };
  $scope.displayDate= false;
  
  
  var options = {
      center: new google.maps.LatLng(29.0729673, -110.95591),
      zoom: 13,
      disableDefaultUI: true,
      draggable: true   
  };
  var mapCanvas = document.getElementById("map");
  var searchInput =   document.getElementById('input');
  var map = new google.maps.Map(mapCanvas, options);
  var autocomplete = new google.maps.places.Autocomplete(searchInput);
  
  autocomplete.bindTo('bounds', map);
  autocomplete.addListener('place_changed', fillInAddress);
  var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  
  
  function fillInAddress() {
    var place = autocomplete.getPlace();
    $scope.location.address=place.formatted_address;
    $scope.location.place_id=place.place_id;
    $scope.location.lat=place.geometry.location.lat();
    $scope.location.lng=place.geometry.location.lng();
    if (place.address_components[3])
    $scope.location.city= place.address_components[3].long_name || "";
    if (place.address_components[7])
    $scope.location.zip=place.address_components[7].long_name || "";
    if (place.address_components[5])
    $scope.location.state=place.address_components[5].long_name || "";
    if (place.address_components[6])
    $scope.location.country=place.address_components[6].long_name || "";
    $scope.location.place=place.name || "";
    
    $scope.$apply()

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
     marker.setIcon(/** @type {google.maps.Icon} */({
       url: place.icon,
       size: new google.maps.Size(71, 71),
       origin: new google.maps.Point(0, 0),
       anchor: new google.maps.Point(17, 34),
       scaledSize: new google.maps.Size(35, 35)
     }));
     marker.setPosition(place.geometry.location);
     marker.setVisible(true);

     var address = '';
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



  $scope.save = function() {
    var locationData = {
       name: $scope.location.place,
       location: [$scope.location.lng, $scope.location.lat ],
       place_id: $scope.location.place_id,
       address : $scope.location.address
    };
  
    $http.post("/api/locations", locationData).then(function (response) {
      var eventData = {
        location_id   : response.data._id,
        place         : $scope.location.place,
        place_id      : $scope.location.place_id,
        name          : $scope.event.title,
        description   : $scope.event.description,
        datetime      : $scope.event.date,
        category      : $scope.event.category
      };
      $http.post("/api/events", eventData).then(function(response) {
         $scope.apiSuccess = true;
         setTimeout(function () {
            $state.go('events');
         }, 2000); 
      });
    }, function (response) {
      console.error(response)
    });
  };
}
