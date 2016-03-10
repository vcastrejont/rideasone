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
        image: imageUrl + "?sz=30"
      };

      return user;
    },
    function(error) {
      return error;
    });
  };

  return profileAPIService;
});
