angular.module('carPoolingApp').controller('eventsShowCtrl', eventsShowCtrl);

eventsShowCtrl.$inject = ['$scope', '$http', '$state' ,'$window'];

function eventsShowCtrl ($scope, $http,  $state, $window) {
  $scope.id = $state.params.id
  $scope.view= {
    alerts:[],
    signed:false,
    seats: "",
    driver:"",
    signmeup: true,
    option:1,
    user:{
      id: $window.user_id,
      name: $window.user_name,
    },
    apiSuccess : false,
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
        title: ''
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
      this.seats = "";	
      this.driver = "";
    },
    deleteEvent:function(){
      $http.delete('/api/event/'+$scope.id).then(function(response) {
        $state.go('events');
      }, function(response) {
        console.log('Error: ' + response);
      });	
    },
    signMeUp:function(){
      var self = this;
      this.signed = true;
      $http.put('/api/event/signup/'+$scope.id).then(function(response) {
          self.alerts.push({msg: response.data.message});
          setTimeout(function () {
             $scope.$apply(function()  {  self.closeAlert(); });
          }, 2000); 
            console.log(response);
        }, function(response) {
            console.log('Error: ' + response);
      });	
    },
    confirm:function(){
      var self = this;
      var eventData = {
        option : this.option,
        seats  : this.seats,
        driver : this.driver
      };
      $http.put('/api/events/'+$scope.id, eventData).then(function(response) {
            console.log(response);
            self.alerts.push({msg: response.data.message});
            setTimeout(function () {
               $scope.$apply(function()  {  self.closeAlert(); });
            }, 2000);
        }, function(response) {
            console.log('Error: ' + response);
      });	
    },
  
    closeAlert : function(index) {
      this.alerts.splice(index, 1);
    }
    
  };

  //Load data, Todo create a service for this
  $http.get('/api/event/'+$scope.id).then(function(response) {
        //console.table(response);
        $scope.view.event = response.data;
        $scope.view.event.lift = _.where(response.data.attendees, {lift: true});
        $scope.view.showMap();
    }, function(response) {
        console.error('Error: ' + response.data);
  });
    
  
  
};
