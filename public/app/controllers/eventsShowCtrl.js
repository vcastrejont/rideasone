angular.module('carPoolingApp').controller('eventsShowCtrl', eventsShowCtrl);

eventsShowCtrl.$inject = ['$scope', '$http', '$state' ];

function eventsShowCtrl ($scope, $http,  $state) {
  $scope.id = $state.params.id

  $scope.view= {
    n_seats: "",
    signmeup: true,
    signMeUp:function(){
      this.signmeup = !this.signmeup;
    },
    showMap:function(){
      var myLatLng = {lat: this.event.location[1],lng: this.event.location[0]};
      var options = {
          center: new google.maps.LatLng(this.event.location[1], this.event.location[0]),
          zoom: 17,
          disableDefaultUI: true,
          draggable: true   
      };
      var mapCanvas = document.getElementById("map");
      var map = new google.maps.Map(mapCanvas, options); 
      var infowindow = new google.maps.InfoWindow();
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
      });
      
      var infowindow = new google.maps.InfoWindow({
        content: this.event.place
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
      infowindow.open(map, marker);
    },
    clearOptions:function(){
      this.n_seats = "";	
      this.driver = "";
    },
    saveData:function(){
      var eventData = {
        n_seats : this.n_seats
      };
      $http.put('/api/events/'+$scope.id, eventData).then(function(response) {
            console.log(response);
        }, function(response) {
            console.log('Error: ' + response);
      });	
    }
    
  };

  //Todo create a service for this
  $http.get('/api/event/'+$scope.id).then(function(response) {
        console.table(response);
        $scope.view.event= response.data;
        $scope.view.showMap();
    }, function(response) {
        console.error('Error: ' + response.data);
  });
    
    
  
  
};
