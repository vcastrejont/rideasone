angular.module('carpoolingVan')

.factory("routesService", function($firebaseArray, firebaseRef, $http,
  dateService) {

  var routesRef = new Firebase(firebaseRef + "routes"),
    routes = $firebaseArray(routesRef);

  return {
    routes: routes,
    addUser: addUser,
    deleteUser: deleteUser,
    start: start,
    stop: stop,
    pickupUser: pickupUser,
    bypassUser: bypassUser
  };

  function addUser(user, route, routes) {

    angular.forEach(routes, function(r) {
      if(r.$id == route.$id) {
        var name = user.name,
          loc = user.location,
          userObj = {};
          userObj[user.$id] = {
            "name": name,
            "location": loc
          };

        $http.patch(firebaseRef + "routes/" + route.$id + "/passengers.json",
          userObj);
      }
      else {
        deleteUser(user, r)
        .then(null, function errorDeleteUser(error) {
          alert(error);
        });
      }
    });
  }

  function deleteUser(user, route) {

    return $http.delete(firebaseRef + "routes/" + route.$id + "/passengers/" +
      user.$id + ".json");
  }

  function pickupUser(userId, route, flag) {

    return $http.patch(firebaseRef + "routes/" + route.$id + "/passengers/" +
      userId + ".json", {
        onboard: flag ? dateService.format("now", "HH:mm:ss") : false
    });
  }

  function bypassUser(userId, route, bypass) {

    return $http.patch(firebaseRef + "routes/" + route.$id + "/passengers/" +
      userId + ".json", {
        bypass: bypass ? dateService.format("now", "HH:mm:ss") : false
    });
  }

  function start(route) {

    iterateOverPassengers(route, pickupUser, false);

    return $http.patch(firebaseRef + "routes/" + route.$id + ".json", {
      departureTime: dateService.format("now", "HH:mm:ss"),
      arrivalTime: false
    });
  }

  function stop(route) {
    var passengersLeft = 0;

    iterateOverPassengers(route, function(userId, route, flag, p) {
      if(!p.onboard && !p.bypass) {
        passengersLeft++;
      }
    });

    if(passengersLeft == 0) {
      iterateOverPassengers(route, bypassUser, false);

      return $http.patch(firebaseRef + "routes/" + route.$id + ".json", {
        departureTime: false,
        arrivalTime: dateService.format("now", "HH:mm:ss")
      });
    }
    else {
      var pluralized = passengersLeft == 1 ? ["is", "buddy"] : ["are", "buddies"];

      return Promise.reject("Hey! There " + pluralized[0] + " still " +
        passengersLeft + " " + pluralized[1] + " " + "waiting for you");
    }
  }

  function iterateOverPassengers(route, callback, flag) {
    angular.forEach(route.passengers, function(p, userId) {
      callback(userId, route, flag, p);
    });
  }
});
