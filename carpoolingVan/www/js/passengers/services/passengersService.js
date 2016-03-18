angular.module('carpoolingVan')

.factory("Passengers", function($firebaseArray, firebaseRef) {
  var itemsRef = new Firebase(firebaseRef + "users");
  return $firebaseArray(itemsRef);
})
