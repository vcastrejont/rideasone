angular.module('carpoolingVan')

.controller("usersCtrl", function($scope, usersService, $ionicModal) {

  $scope.users = usersService.users;
  $scope.addUser = addUser;
  $scope.saveUser = saveUser;

  // Global function from adding button template
  $scope.addFunction = $scope.addUser;

  function addUser() {
    $scope.newUser = {};

    $ionicModal.fromTemplateUrl('/templates/newUserModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.openModal();
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
  }

  function saveUser() {
    $scope.users.$add($scope.newUser)
    .then(function okSaveUser() {
      $scope.closeModal();
    },
    function errorSaveUser(error) {
      console.log(error);
    });
  }
});
