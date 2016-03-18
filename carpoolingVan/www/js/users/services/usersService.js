angular.module('carpoolingVan')

.factory("usersService", function($firebaseArray, firebaseRef, $http) {
  var usersRef = new Firebase(firebaseRef + "users");
  var users = $firebaseArray(usersRef);

  return {
    users: users,
    update: update
  }

  function update(user) {
    var userId = user.$id,
      user = {
        address: user.address,
        name: user.name
      };

    return $http.put(firebaseRef + "users/" + userId + ".json", user);
  }
});
