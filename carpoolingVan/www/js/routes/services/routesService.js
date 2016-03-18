angular.module('carpoolingVan')

.factory("routesService", function($firebaseArray, firebaseRef, $http) {
  var routesRef = new Firebase(firebaseRef + "routes"),
    routes = $firebaseArray(routesRef);

  return {
    routes: routes,
    addUser: addUser,
    deleteUser: deleteUser,
    passengers: passengers,
    pickupUser: pickupUser
  };

  function addUser(user, route) {
    var name = user.name,
      userObj = {};
      userObj[user.$id] = {
        "name": name
      };

    return $http.patch(firebaseRef + "routes/" + route.$id + "/passengers.json",
      userObj
    );
  }

  function deleteUser(user, route) {

    return $http.delete(firebaseRef + "routes/" + route.$id + "/passengers/" +
      user.$id + ".json");
  }

  function pickupUser(user, route, flag) {
    var flag = !!flag;

    return $http.patch(firebaseRef + "routes/" + route.$id + "/passengers/" +
      user.$id + ".json", {
        onboard: !flag
      });
  }

  function passengers(route) {
    var passengersRef = new Firebase(firebaseRef + "routes/" + route.$id + "/passengers");
    return $firebaseArray(passengersRef);
  }
});
