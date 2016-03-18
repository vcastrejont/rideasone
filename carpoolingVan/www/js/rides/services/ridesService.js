angular.module('carpoolingVan')

.factory("ridesService", function($firebaseArray, $firebaseObject,
  firebaseRef, $http, $filter) {

  var ridesRef = new Firebase(firebaseRef + "rides"),
    rides = $firebaseArray(ridesRef);

  var strDate = $filter('date')(new Date(), "MM:dd:yyyy");

  return {
    rides: rides,
    passengers: passengers,
    start: start,
    checkIfExists: checkIfExists
  };

  function passengers(route) {
    var routeRef = new Firebase(firebaseRef + "rides/" + route);
    return $firebaseArray(routeRef.child("passengers"));
  }

  function start(route) {
    return $http.put(firebaseRef + "rides/" + route.$id + "|" + strDate + ".json", {
      passengers: route.passengers,
      ontheway: true
    });
  }

  function checkIfExists(route) {
    var url = firebaseRef + "rides/" + route.$id + "|" + strDate;

    return $http.get(url + ".json")
    .then(function okRideExists(res) {
      return !!res.data;
    });
  }
});
