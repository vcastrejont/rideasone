angular.module('carpoolingVan')

.controller("usersCtrl", function($scope, usersService, $ionicModal) {

  $scope.users = usersService.users;
  $scope.addUser = addUser;
  $scope.saveUser = saveUser;
  $scope.updateUser = updateUser;
  $scope.viewInfo = viewInfo;

  // Global function from adding button template
  // $scope.addFunction = $scope.addUser;

  function addUser() {
    $scope.user = {};

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
      $scope.user = {};
    });
  }

  function saveUser() {
    $scope.users.$add($scope.user)
    .then(function okSaveUser() {
      $scope.closeModal();
    },
    function errorSaveUser(error) {
      console.log(error);
    });
  }

  function updateUser() {
    usersService.update($scope.user)
    .then(function okUpdateUser() {
      $scope.closeModal();
    },
    function errorUpdateUser(error) {
      alert(error);
    });
  }

  function viewInfo(user) {

    $scope.user = user;

    $ionicModal.fromTemplateUrl('templates/userModal.html', {
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
      $scope.user = {};
    });
  }
});
