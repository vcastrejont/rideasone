angular.module('carpoolingVan')

.directive("addButton", function() {
  return {
    templateUrl: "/templates/addButtonTemplate.html",
    controller: "usersCtrl"
  }
});
