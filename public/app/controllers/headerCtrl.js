angular.module('carPoolingApp').controller('headerCtrl', function headerCtrl($scope, $firebaseObject) {
  $scope.test= "Menu1";

     
    // var ref = firebase.database().ref('/notifications/');
    // 
    // var obj = $firebaseObject(ref);
    // obj.$loaded().then(function() {
    //   angular.forEach(obj, function(value, key) {
    //   console.log(value, key);
    //   });
    // });
    
    var recentPostsRef = firebase.database().ref('notifications').limitToLast(100);
    recentPostsRef.on('child_added', function(data) {
      var post = data.val();
    //  $(".notifications").append("<li>"+post.title+"</li>" );  
      console.log(data.val()); 
    });
    
    
});
