angular.module('carpoolingVan')

.factory("routesService", function($firebaseArray, firebaseRef) {
  var routesRef = new Firebase(firebaseRef + "routes"),
    routes = $firebaseArray(routesRef);

  return {
    routes: routes,
    passengers: passengers
  };

  function passengers(route) {
    var routeRef = new Firebase(firebaseRef + "routes/" + route);
    return $firebaseArray(routeRef.child("passengers"));
  }
});
