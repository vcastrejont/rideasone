angular.module('carPoolingApp').controller('headerCtrl', function headerCtrl($scope, sessionservice, $firebaseObject) {

  var user = sessionservice.user();
  
  var recentPostsRef = firebase.database().ref('notifications');   
  var ref = firebase.database().ref('notifications/' + user.id );
  ref.on('value', function(snapshot) {
    $scope.notifications = snapshot.val();
    $scope.$apply()
  });
    
  
    
});
