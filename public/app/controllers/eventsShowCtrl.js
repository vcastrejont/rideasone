angular.module('carPoolingApp').controller('eventsShowCtrl', eventsShowCtrl);


eventsShowCtrl.$inject = ['$scope', 'apiservice', '$state','$window'];


//TODO Fer move this to a service maybe?
//TODO Fer refactor
function addDestinationMarkerToMap(map, myLatLng, content) {
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: ''
    });

    var infowindow = new google.maps.InfoWindow({
        content: content
    });
    infowindow.open(map, marker);
    (function (marker, content, leWindow, leMap) {
        google.maps.event.addListener(marker, "click", function (e) {
            leWindow.open(leMap, marker);
        });
    })(marker, content, infowindow, map);
    return marker;
}


function renderDirectionsBetweenMarkers(infoWindow, map, eventDestinationMarker, originMarker, directionsService, directionsDisplay) {
    infoWindow.open(map, originMarker);

    var bounds = new google.maps.LatLngBounds();
    var end = eventDestinationMarker.position;
    var start = originMarker.position;

    bounds.extend(start);
    bounds.extend(end);
    map.fitBounds(bounds);

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
        } else {
            alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
        }
    });
}
function addCarMarkerToMap(mapData, carPosition, content) {

    //map, carPosition, content, directionsService,  directionsDisplay, eventDestinationMarker
    var carMarker = new google.maps.Marker({
        position: carPosition,
        map: mapData.map,
        title: ''
    });

    var infoWindow = new google.maps.InfoWindow({
        content: content
    });

    //TODO cleanup names
    (function (infoWindow, mapData, carMarker) {

        var map = mapData.map;
        var directionsService = mapData.directionsService;
        var directionsDisplay = mapData.directionsDisplay;
        var eventDestinationMarker = mapData.eventDestinationMarker;
        google.maps.event.addListener(carMarker, "click", function (e) {
            renderDirectionsBetweenMarkers(infoWindow, map, eventDestinationMarker, carMarker, directionsService, directionsDisplay);
        });
    })(infoWindow, mapData, carMarker);

    return carMarker;
}

//TODO remove? move to backend?
function stubData(cars) {
    for (var i = 0; i < cars.length; i++) {
        //cars[i].location = [-86.7694625854492, 21.0904502868652];

        if (i === 0) {
            cars[0].location = [-86.7694625854492, 21.0904502868652];
        }
        else if (i === 1) {
            cars[1].location = [-86.7728805541992, 21.1417503356934];
        }
    }
}


function eventsShowCtrl ($scope, apiservice,  $state, $window) {
  $scope.id = $state.params.id;
  $scope.view= {
    alerts:[],
    signed:false,
    seats: "",
    driver:"",
    signmeup: true,
    option:1,
    user:{
      id: $window.user_id,
      name: $window.user_name
    },
      mapData: {}
      ,
    isSigned: function (car) {
      var temp = _.findWhere(car.passengers, {passenger_id: $scope.view.user.id});
      return temp  ? true : false;
    },
      showDirectionsForCar: function(index) {
          console.log("selected car: " + JSON.stringify(this.event.cars[index]));
      },
    getNumber: function(num) {
      return new Array(num);
    },
    init:function(){
      //Load data, Todo create a service for this
      var self = this;
      apiservice.getEvent($scope.id).then(function(response) {
        self.event = response.data;
        self.event.avail = 0;
        self.event.signed = _.where(response.data.attendees, {user_id: self.user.id});
        _.each(response.data.cars, function(carpool, index) {
          var avail = carpool.seats -  carpool.passengers.length;
          self.event.avail += avail;
        });
        self.showMap();
      }, function(response) {
        console.error('Error: ' + response.data);
      });
    },
      showMap: function () {
          var event = this.event;
          //TODO Fer remove
          console.log("#######" + JSON.stringify(event));
          var eventDestination = new google.maps.LatLng(event.location[1], event.location[0]);
          var options = {
              center: eventDestination,
              zoom: 11,
              disableDefaultUI: false,
              draggable: true
          };

          var directionsService = new google.maps.DirectionsService();
          var mapCanvas = document.getElementById("map");
          var map = new google.maps.Map(mapCanvas, options);

          var directionsDisplay = new google.maps.DirectionsRenderer();
          directionsDisplay.setMap(map);


          var eventDestinationMarker = addDestinationMarkerToMap(map, eventDestination, event.place);

          var cars = event.cars;

          //TODO Fer remove
          stubData(cars);

          this.mapData = {
              map: map,
              directionsService: directionsService,
              directionsDisplay: directionsDisplay,
              eventDestinationMarker:eventDestinationMarker
          };

          var car, carMarker;
          var markers = [];
          for (var i = 0; i < cars.length; i++) {
              car = cars[i];
              carMarker = addCarMarkerToMap(this.mapData, new google.maps.LatLng(car.location[1], car.location[0]) , car.driver_name);
              markers.push(carMarker);
          }


          this.mapData.carMarkers = markers;
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
        id         : $scope.view.event._id,
        seats      : $scope.view.seats,
        comments   : $scope.view.comments,
        driver_id  : $scope.view.user.id
      };
      apiservice.addCarToEvent(eventData).then(function(response) {
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
        car_id   : carid
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
        event_id : this.event._id,
        car_id   : carid,
        extra    : this.extra
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
