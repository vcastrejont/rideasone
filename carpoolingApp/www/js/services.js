angular.module('carpooling.services', [])

.factory('AuthService', function (clientId, $cordovaOauth) {
  var authService = {};

  authService.login = function() {
    return $cordovaOauth.google(clientId, ["email", "profile"]);
  };

  return authService;
})

.factory('ProfileAPIService', function ($http) {
  var profileAPIService = {};

  profileAPIService.getProfile = function(accessToken) {
    var url = 'https://www.googleapis.com/plus/v1/people/me?access_token=' + accessToken;

    return $http.get(url)
    .then(function(response) {
      var data = response.data,
          imageUrl = data.image.url,
          user;

      imageUrl = imageUrl.split("?")[0];

      user = {
        id: data.id,
        name: data.displayName,
        email: data.emails[0].value,
        image: imageUrl + "?sz=40"
      };

      return user;
    },
    function(error) {
      return error;
    });
  };

  return profileAPIService;
})

.factory('eventsFactory', function (apiUrl, $http) {

  return {
    getRideInfo: getRideInfo,
    getAll: getAll
  };

  function getRideInfo(user, eventId) {

    return $http.get("https://gist.githubusercontent.com/vcastrejont/c69be8644fc4e1a8bd7f0613f9bd9f28/raw/aefe1aef8d28abcb021e651bbe7a7e3a3771844e/event.json");

    // return $http.get(apiUrl + 'event/' + eventId);
  }

  function getAll() {

    return $http.get(apiUrl + 'events/');
  }
})

.factory('mapFactory', function($cordovaGeolocation) {
  var mapOptions = {
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map;
  var marker;
  var bounds = new google.maps.LatLngBounds();

  return {
    calculateDistance: calculateDistance
  };

  function calculateDistance(lat, lng) {
    var eventLatLng,
    distance,
    myLatLng;

    return $cordovaGeolocation.getCurrentPosition({
      timeout: 10000, enableHighAccuracy: true
    })
    .then(function(position) {

      myLatLng = new google.maps.LatLng(position.coords.latitude,
      position.coords.longitude);

      mapOptions.center = myLatLng;

      if(!map) {
        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        bounds.extend(myLatLng);

        marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: myLatLng
        });

        map.fitBounds(bounds);
        map.panToBounds(bounds);

        google.maps.event.trigger(map, 'resize');
      }
      else {
        marker.setVisible(false);

        marker = new google.maps.Marker({
          map: map,
          position: myLatLng
        });

        marker.setVisible(true);
      }

      eventLatLng = new google.maps.LatLng(lat, lng);
      distance = google.maps.geometry.spherical.computeDistanceBetween(myLatLng, eventLatLng);

      return distance;
    });
  }
});
