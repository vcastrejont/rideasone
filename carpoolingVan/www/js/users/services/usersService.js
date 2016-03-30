angular.module('carpoolingVan')

.factory("usersService", function($firebaseArray, $firebaseObject, firebaseRef, $http) {
  var usersRef = new Firebase(firebaseRef + "users");
  var users = $firebaseArray(usersRef);

  return {
    users: users,
    get: get,
    update: update,
    remove: remove
  }

  function get(userId) {

    var userRef = new Firebase(firebaseRef + "users/" + userId);
    var obj = $firebaseObject(userRef);

    return obj.$loaded();
  }

  function update(user) {

    var userId = user.$id,
      user = {
        location: {
          "address": user.location.address,
          "lat": user.location.lat,
          "lng": user.location.lng
        },
        name: user.name
      };

    return $http.put(firebaseRef + "users/" + userId + ".json", user);
  }

  function remove(userId) {

    return $http.delete(firebaseRef + "users/" + userId + ".json");
  }
});
