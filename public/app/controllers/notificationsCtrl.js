angular.module('carPoolingApp').controller('notificationsCtrl', notificationsCtrl);

notificationsCtrl.$inject = ['$scope','sessionservice', 'apiservice','$state' ];


function notificationsCtrl ($scope, sessionservice, apiservice, $state ) {
  var user = sessionservice.user();

  $scope.view = {
    shown : {},
    
    init: function() {
      var self = this;
      apiservice.getNotifications(user.id)
        .success(function(notifications) {
            self.notifications = notifications;
            console.log(notifications);
        })
        .error(function(notifications) {
            console.error('Error: ' + notifications.error);
        });
    },
    show: function(message) {
      this.shown = message;
    }
    
  }
  $scope.view.init();
  
  
  
  
  
  
  
    
}
