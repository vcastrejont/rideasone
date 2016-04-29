angular.module('carpoolingVan')

.factory("usersService", function($firebaseArray, $firebaseObject, firebaseRef, $q) {
  var usersRef = new Firebase(firebaseRef + "users");
  var users = $firebaseArray(usersRef);

  return {
    users: users,
    get: get,
    update: update
  };

  function get(userId) {
    var userRef = usersRef.child(userId);
    var obj = $firebaseObject(userRef);
    return obj.$loaded();
  }

  function update(user) {
    var def = $q.defer();

    usersRef.child(user.$id).update({
      location: {
        "address": user.location.address,
        "lat": user.location.lat,
        "lng": user.location.lng
      }
    }, function(error) {
      if(!error) {
        def.resolve(true);
      }
      else {
        def.reject(error);
      }
    });

    return def.promise;
  }
});
