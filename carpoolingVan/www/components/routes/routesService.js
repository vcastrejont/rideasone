angular.module('carpoolingVan')

.factory("routesService", function($firebaseArray, $firebaseObject, firebaseRef,
  $http, dateService, usersService, $q) {

  var routesRef = new Firebase(firebaseRef + "routes"),
  routes = $firebaseArray(routesRef);

  return {
    routes: routes,
    getRoute: getRoute,
    addUser: addUser,
    deleteUser: deleteUser,
    start: start,
    stop: stop,
    pickupUser: pickupUser,
    bypassUser: bypassUser
  };

  function getRoute(routeId) {
    var routeRef = routesRef.child(routeId),
    obj = $firebaseObject(routeRef);
    return obj.$loaded();
  }

  function addUser(user, route, routes) {
    angular.forEach(routes, function(r) {
      if(r.$id == route.$id) {
        // var userObj = {};
        //   userObj[user.$id] = {
        //     "bypass": false,
        //     "onboard": false
        //   };
        //
        // $http.patch(firebaseRef + "routes/" + route.$id + "/passengers.json",
        //   userObj);

        var def = $q.defer();

        routesRef.child(route.$id).child("passengers").child(user.$id).set({
          bypass: false,
          onboard: false
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
      else {
        deleteUser(user, r)
        .then(null, function errorDeleteUser(error) {
          alert(error);
        });
      }
    });
  }

  function deleteUser(user, route) {
    var def = $q.defer();

    routesRef.child(route.$id).child("passengers").child(user.$id).remove(function(error) {
      if(!error) {
        def.resolve(true);
      }
      else {
        def.reject(error);
      }
    });

    return def.promise;
  }

  // function pickupUser(userId, route, flag) {
  //   return $http.patch(firebaseRef + "routes/" + route.$id + "/passengers/" +
  //     userId + ".json", {
  //       onboard: flag ? dateService.format("now", "HH:mm:ss") : false
  //   });
  // }

  function pickupUser(userId, route, flag) {
    var def = $q.defer();

    routesRef.child(route.$id).child("passengers").child(userId).update({
      onboard: flag ? dateService.format("now", "HH:mm:ss") : false
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

  function bypassUser(userId, route, bypass) {
    var def = $q.defer();

    routesRef.child(route.$id).child("passengers").child(userId).update({
      bypass: bypass ? dateService.format("now", "HH:mm:ss") : false
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

  function start(route) {
    var def = $q.defer();

    iterateOverPassengers(route, pickupUser, false);    

    routesRef.child(route.$id).update({
      departureTime: dateService.format("now", "HH:mm:ss"),
      arrivalTime: false
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

  function stop(route) {
    var passengersLeft = 0;

    iterateOverPassengers(route, function(userId, route, flag, p) {
      if(!p.onboard && !p.bypass) {
        passengersLeft++;
      }
    });

    if(passengersLeft === 0) {
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
