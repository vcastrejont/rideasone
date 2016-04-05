angular.module('carpoolingVan')

.factory("usersService", function($firebaseArray, firebaseRef, $http) {
  var usersRef = new Firebase(firebaseRef + "users");
  var users = $firebaseArray(usersRef);

  return {
    users: users,
    patch: patch
  }

  function patch(user, route) {
    return $http.patch(firebaseRef + "users/" + user + ".json", {
      "route": route
    });
  }
});
