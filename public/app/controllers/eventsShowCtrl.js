angular.module('carPoolingApp').controller('eventsShowCtrl', eventsShowCtrl);

eventsShowCtrl.$inject = ['$scope', 'apiservice', '$state','$window','mapFactory'];

function eventsShowCtrl ($scope, apiservice,  $state, $window, mapFactory ) {
  $scope.id = $state.params.id;
  $scope.map = mapFactory.getApi();
  $scope.map.placesAutocomplete('autocomplete');
  
  $scope.messageDriver = function(car) {
      $scope.messageCar = car;
      $('#sendMessageModal').modal("show");
  };

  $scope.view= {
    showRide: function (ride) {
      $scope.view.showride = ride;
      console.log(ride);
       
      //$scope.map.showRoute(origin, destination);
    },
    init:function(){
      var self = this;
      apiservice.getEvent($scope.id).then(function(response) {
        self.event = response.data;
        $scope.map.addMarker({lat:self.event.place.location.lat, lng:self.event.place.location.lon, center:true});

      }, function(response) {
        console.error('Error: ' + response.data);
      });
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
    
    addCar:function(){
    
      var self = this;
      
      var placeData = mapFactory.getEventLocationData();
      var carData = {
        "place": {
            "name": placeData.place_name,
            "google_places_id": placeData.place_id,
            "address": placeData.address,
            "location": {
              "lat": placeData.location.lat,
              "lon": placeData.location.lon
            }
        },
        departure  : new Date(),
        seats      : $scope.newcar.seats,
        comments   : $scope.newcar.comments,
        going      : true
      };
      console.log(carData);
      apiservice.addCarToEvent($scope.view.event._id, carData).then(function(response) {
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
