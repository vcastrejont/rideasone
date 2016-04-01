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

      console.log(user);

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
    getInfo: getInfo,
    getAll: getAll
  };

  function getInfo(eventId) {

    return $http.get("https://gist.githubusercontent.com/vcastrejont/c69be8644fc4e1a8bd7f0613f9bd9f28/raw/aefe1aef8d28abcb021e651bbe7a7e3a3771844e/event.json");

    // return $http.get(apiUrl + 'event/' + eventId);
  }

  function getAll() {

    return $http.get(apiUrl + 'events/');
  }
});
