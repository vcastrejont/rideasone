angular.module('carPoolingApp').controller('eventsShowCtrl', eventsShowCtrl);

eventsShowCtrl.$inject = ['$scope', 'apiservice', '$state','$window'];

function eventsShowCtrl ($scope, apiservice,  $state, $window) {
  $scope.id = $state.params.id;

  $scope.messageCar = null;
  $scope.message = {
      text: ""
  };
  

  $scope.messageDriver = function(car) {
      $scope.messageCar = car;

      $('#sendMessageModal').modal("show");
  };

  $scope.sendMessage = function() {
      if(!$scope.message.text) return;

      apiservice.sendMessage({
          eventId: $state.params.id,
          carId: $scope.messageCar["_id"],
          message: $scope.message.text
      })
      .success(function(data) {
          $('#sendMessageModal').modal("hide");
          alert("Message sent!");
      })
      .error(function(error) {
          console.error(error);
      });
  };

  $scope.view= {
    alerts:[],
    signed:false,
    seats: "",
    driver:"",
    showride:false,
    signmeup: true,
    option:1,
    user:{
      id: $window.user_id,
      name: $window.user_name,
      going: true,
      back: true
    },
    goingRide: {
      passengers: [],
      extraPass: 0
    },
    backRide: {
      passengers: [],
      extraPass: 0
    },
    isSigned: function (car) {
      var temp = _.findWhere(car.passengers, {passenger_id: $scope.view.user.id});
      return temp  ? true : false;
    },
    getNumber: function(num) {
      return new Array(num);
    },
    init:function(){
      //Load data, Todo create a service for this
      var self = this;
      apiservice.getEvent($scope.id).then(function(response) {
        self.event = response.data;
        console.log(response.data.datetime)
      
        self.event.date = moment(response.data.datetime).format('MMM. d, YYYY');
        self.event.dateString = moment(response.data.datetime).calendar() ;
      
        self.event.avail = 0;
        self.event.signed = _.where(response.data.attendees, {user_id: self.user.id});
        _.each(response.data.cars, function(carpool, index) {
          var avail = carpool.seats -  carpool.passengers.length;
          self.event.avail += avail;

          self.goingRide.passengers = [];
          self.backRide.passengers = [];

          self.goingRide.extraPass = 0;
          self.backRide.extraPass = 0;

          angular.forEach(carpool.passengers, function(p) {
            if(p.going) {
              self.goingRide.passengers.push(p);
            }

            if(p.back){
              self.backRide.passengers.push(p);
            }
          });
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
          zoom: 13,
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
      apiservice.deleteEvent($scope.id).then(function(response) {
        $state.go('events');
      }, function(response) {
        console.error('Error: ' + response);
      });
    },
    signMe:function(){
      var self = this;
      this.signed = true;
      apiservice.signupToEvent($scope.id).then(function(response) {
          self.alerts.push({msg: response.data.message});
          setTimeout(function () {
            $scope.$apply(function()  {  self.closeAlert(); });
            $scope.view.init();
          }, 1000);
              $scope.view.init();
            //console.log(response);
        }, function(response) {
            console.error('Error: ' + response);
      });
    },
    addCar:function(){
      var self = this;
      var eventData = {

        seats      : $scope.view.seats,
        comments   : $scope.view.comments,
        driver_id  : $scope.view.user.id
      };
      apiservice.addCarToEvent($scope.view.event._id, eventData).then(function(response) {
            self.alerts.push({msg: response.data.message});
            setTimeout(function () {
               $scope.$apply(function()  {  self.closeAlert(); });
               $scope.view.init();
            }, 1000);
        }, function(response) {
            console.error('Error: ' + response);
      });
    },
    deleteCar:function(carid){
      if (confirm("Are you sure?")) {
        var carData = {
          id         : $scope.view.event._id,
          carid      : carid
        };
        var self = this;
        apiservice.deleteCarFromEvent(carData).then(function(response) {
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
        car_id   : carid,
        going    : $scope.view.user.going,
        back     : $scope.view.user.back
      };
      var self = this;
      apiservice.joinCar(carData).then(function(response) {
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
        apiservice.leaveCar(carData).then(function(response) {
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
        event_id    : this.event._id,
        car_id      : carid,
        extra_going : this.goingRide.extraPass,
        extra_back  : this.backRide.extraPass,
      };
      var self = this;
      apiservice.addExtraCar(carData).then(function(response) {
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
