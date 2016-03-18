angular.module('carpoolingVan')

.factory("RidesService", function($firebaseArray, firebaseRef) {
  var ridesRef = new Firebase(firebaseRef + "rides"),
    rides = $firebaseArray(ridesRef);

  return {
    rides: rides,
    passengers: passengers
  };

  function passengers(route) {
    var routeRef = new Firebase(firebaseRef + "rides/" + route);
    return $firebaseArray(routeRef.child("passengers"));
  }
});
