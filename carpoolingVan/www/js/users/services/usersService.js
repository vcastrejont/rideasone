angular.module('carpoolingVan')

.factory("usersService", function($firebaseArray, $firebaseObject, firebaseRef, $http) {
  var usersRef = new Firebase(firebaseRef + "users");
  var users = $firebaseArray(usersRef);

  return {
    users: users,
    get: get,
    update: update
  };

  function get(userId) {
    var userRef = new Firebase(firebaseRef + "users/" + userId);
    var obj = $firebaseObject(userRef);
    return obj.$loaded();
  }

  function update(user) {
    var userId = user.$id,
    u = {
      location: {
        "address": user.location.address,
        "lat": user.location.lat,
        "lng": user.location.lng
      }
    };
    return $http.patch(firebaseRef + "users/" + userId + ".json", u);
  }
});
