angular.module('carPoolingApp').controller('eventsShowCtrl', eventsShowCtrl);

eventsShowCtrl.$inject = ['$scope', '$http', '$state','$window'];

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
    init:function(){
      //Load data, Todo create a service for this, move it to the back end
      $http.get('/api/event/'+$scope.id).then(function(response) {
        $scope.view.event = response.data;
        $scope.view.event.avail = 0;
        $scope.view.event.lift = _.where(response.data.attendees, {lift: true});
        $scope.view.event.signed = _.where(response.data.attendees, {user_id: $scope.view.user.id});
        $scope.view.event.driving = _.where(response.data.carpooling, {driver_id: $scope.view.user.id});
        $scope.view.isSigned = function (car) {
          var temp = _.findWhere(car.passanger, {user_id: $scope.view.user.id});
          return temp  ? true : false;
        }
        $scope.view.event.passanger = _.where(response.data.carpooling, {user_id: $scope.view.user.id});
        _.each(response.data.carpooling, function(carpool, index) {
          var avail = carpool.seats -  carpool.passanger.length;
          $scope.view.event.avail += avail;
          $scope.view.passanger = _.where(carpool.passanger, {user_id:$scope.view.user.id});
          if ($scope.view.passanger.length > 0){
            $scope.view.car = index;
          }
        });
      
        $scope.view.showMap();
      }, function(response) {
        console.error('Error: ' + response.data);
      });
      
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
        title: ''
      });
      
      var infowindow = new google.maps.InfoWindow({
        content: this.event.place
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
    signMe:function(){
      var self = this;
      this.signed = true;
      $http.put('/api/event/signup/'+$scope.id).then(function(response) {
          self.alerts.push({msg: response.data.message});
          setTimeout(function () {
             $scope.$apply(function()  {  self.closeAlert(); });
          }, 2000); 
              $scope.view.init();
            //console.log(response);
        }, function(response) {
            console.log('Error: ' + response);
      });	
    },
    addCar:function(){
      var self = this;
      var eventData = {
        seats      : $scope.view.seats,
        driver_id  : $scope.view.user.id
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
    carPooling:function(){
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


    
  $scope.view.init();
  
};
