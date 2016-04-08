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
    isSigned: function (car) {
      var temp = _.findWhere(car.passanger, {user_id: $scope.view.user.id});
      return temp  ? true : false;
    },
    getNumber: function(num) {
      return new Array(num);   
    },  
    init:function(){
      //Load data, Todo create a service for this
      var self = this;
      $http.get('/api/event/'+$scope.id).then(function(response) {
        self.event = response.data;
        self.event.avail = 0;
        self.event.signed = _.where(response.data.attendees, {user_id: self.user.id});
        _.each(response.data.cars, function(carpool, index) {
          var avail = carpool.seats -  carpool.passanger.length;
          self.event.avail += avail;
        });
        self.showMap();
      }, function(response) {
        console.error('Error: ' + response.data);
      });
    },
    showMap:function(){
      var myLatLng = {lat: this.event.location[1],lng: this.event.location[0]};
      var options = {
          center: new google.maps.LatLng(this.event.location[1], this.event.location[0]),
          zoom: 17,
          disableDefaultUI: false,
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
            $scope.view.init();
          }, 1000); 
              $scope.view.init();
            //console.log(response);
        }, function(response) {
            console.log('Error: ' + response);
      });	
    },
    addCar:function(){
      var self = this;
      var eventData = {
        id         : $scope.view.event._id,
        seats      : $scope.view.seats,
        comments   : $scope.view.comments,
        driver_id  : $scope.view.user.id
      };
      $http.post('/api/events/addcar', eventData).then(function(response) {
            console.log(response);
            self.alerts.push({msg: response.data.message});
            setTimeout(function () {
               $scope.$apply(function()  {  self.closeAlert(); });
               $scope.view.init();
            }, 1000);
        }, function(response) {
            console.log('Error: ' + response);
      });	
    },
    deleteCar:function(carid){
      if (confirm("Are you sure?")) {
        var carData = {
          id         : $scope.view.event._id,
          carid      : carid
        };
        var self = this;
        $http.post('/api/events/deletecar', carData).then(function(response) {
            self.alerts.push({msg: response.data.message});
            setTimeout(function () {
               $scope.$apply(function()  {  self.closeAlert(); });
               $scope.view.init();
            }, 1000);
          }, function(response) {
              console.log('Error: ' + response);
        });	
      }
    },
    joinCar:function(carid){
      var carData = {
        event_id : $scope.view.event._id,
        car_id   : carid
      };
      var self = this;
      $http.post('/api/events/joincar', carData).then(function(response) {
          self.alerts.push({msg: response.data.message});
          setTimeout(function () {
             $scope.$apply(function()  {  self.closeAlert(); });
             $scope.view.init();
          }, 1000);
        }, function(response) {
            console.log('Error: ' + response);
      });	
      
    },
    leaveCar:function(carid){
      if (confirm("Are you sure ?")) {
        var carData = {
          event_id  : $scope.view.event._id,
          car_id    : carid
        };
        var self = this;
        $http.post('/api/events/leavecar', carData).then(function(response) {
            self.alerts.push({msg: response.data.message});
            setTimeout(function () {
               $scope.$apply(function()  {  self.closeAlert(); });
               $scope.view.init();
            }, 1000);
          }, function(response) {
              console.log('Error: ' + response);
        });	
      }
    },
    addExtra:function(carid){
      var carData = {
        event_id : this.event._id,
        car_id   : carid,
        extra    : this.extra 
      };
      var self = this;
      $http.post('/api/events/addExtra', carData).then(function(response) {
          self.alerts.push({msg: response.data.message});
          setTimeout(function () {
             $scope.$apply(function()  {  self.closeAlert(); });
             $scope.view.init();
          }, 1000);
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
