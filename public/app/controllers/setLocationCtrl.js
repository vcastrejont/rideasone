angular.module('carPoolingApp').controller('setLocationCtrl', setLocationCtrl);

eventsCtrl.$inject = ['$scope', 'userservice' ];

function setLocationCtrl($scope, userservice) {
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

  $scope.setUserLocation = function(geolocate) {
    var latitude, longitude;

    if(geolocate) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        latitude = pos.latitude;
        longitude = pos.longitude;
      });
    };

    var user = {
      provider_id: window.user.provider_id,
      lat: $scope.location.lat,
      lng: $scope.location.lng
    }

    userservice.setUserLocation(user)
    .success()
    .error();
  }

  $scope.getGeolocation = function() {
  }
}
