angular.module('carpoolingVan')

.factory("routesService", function($firebaseArray, $firebaseObject, firebaseRef,
  dateService, $q, authFactory) {

  var routesRef = new Firebase(firebaseRef + "routes"),
  routes = $firebaseArray(routesRef);

  return {
    routes: routes,
    getRoute: getRoute,
    join: join,
    leave: leave,
    start: start,
    stop: stop,
    pickupUser: pickupUser,
    bypass: bypass
  };

  function getRoute(routeId) {
    var routeRef = routesRef.child(routeId),
    obj = $firebaseObject(routeRef);
    return obj.$loaded();
  }

  function join(route) {
    var user = authFactory.currentUser();
    var def = $q.defer();

    angular.forEach(routes, function(r) {
      if(r.$id == route.$id) {
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
      }
      else {
        leave(r).then(function() {
          def.resolve(true);
        }, function errorDeleteUser(error) {
          def.reject(error);
        });
      }
    });
    return def.promise;
  }

  function leave(route) {
    var user = authFactory.currentUser();
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

  function bypass(userId, route, bypass) {
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
    var def = $q.defer();
    var passengersLeft = 0;

    iterateOverPassengers(route, function(userId, route, flag, p) {
      if(!p.onboard && !p.bypass) {
        passengersLeft++;
      }
    });

    if(passengersLeft === 0) {
      iterateOverPassengers(route, bypass, false);

      routesRef.child(route.$id).update({
        departureTime: false,
        arrivalTime: dateService.format("now", "HH:mm:ss")
      }, function(error) {
        if(!error) {
          def.resolve(true);
        }
        else {
          def.reject(error);
        }
      });
    }
    else {
      var pluralized = passengersLeft == 1 ? ["is", "buddy"] : ["are", "buddies"];

      def.reject("Hey! There " + pluralized[0] + " still " +
        passengersLeft + " " + pluralized[1] + " " + "waiting for you");
    }

    return def.promise;
  }

  function iterateOverPassengers(route, callback, flag) {
    angular.forEach(route.passengers, function(p, userId) {
      callback(userId, route, flag, p);
    });
  }
});
