angular.module('carPoolingApp').controller('eventsCtrl', eventsCtrl);

eventsCtrl.$inject = ['$scope', '$window', 'apiservice','mapFactory' ];

function eventsCtrl ($scope, $window, apiservice, mapFactory) {

  $scope.api = mapFactory.getApi();
  $scope.api.defaultLocation();
  
  apiservice.getEvents()
    .success(function(data) {
        $scope.nextEvents=data;
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
  apiservice.getPastEvents()
    .success(function(data) {
        $scope.pastEvents=data;
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
}
angular.module('carPoolingApp').controller('eventsNewCtrl', eventsNewCtrl);

eventsNewCtrl.$inject = ['$scope', 'apiservice', 'mapService',  '$state','mapFactory' ];

function eventsNewCtrl ($scope, apiservice, mapService, $state, mapFactory ) {
  $scope.location = {};
  $scope.event = {
    date: new Date()
  };
  $scope.api = mapFactory.getApi();
  $scope.api.defaultLocation();
  
  $scope.displayDate= false;
  

  
  $scope.api.placesAutocomplete('autocomplete');
  
  $scope.initTimepicker = function () {
    $(function () {
     $('.timepicker').timepicker({
       timeFormat: 'h:mm p',
       interval: 60,
       minTime: '1',
       maxTime: '11:00pm',
       defaultTime: '11',
       startTime: '12:00',
       dynamic: false,
       dropdown: true,
       scrollbar: true
     });
    });

  };

  $scope.initTimepicker();
     
};
angular.module('carPoolingApp').controller('eventsShowCtrl', eventsShowCtrl);

eventsShowCtrl.$inject = ['$scope', 'apiservice', '$state','$window','mapFactory'];

function eventsShowCtrl ($scope, apiservice,  $state, $window, mapFactory ) {
  $scope.map = mapFactory.getApi();
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
    ride:null,
    showRide: function (ride) {
      console.log(ride.location);
      console.log($scope.view.event.location);
      $scope.view.ride = ride;
      var origin = ride.location[1]+","+ ride.location[0];
      var destination = $scope.view.event.location[1]+","+$scope.view.event.location[0]; 
      $scope.map.showRoute(origin, destination);
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
        console.log( response.data);
        self.event = response.data;
        
        $scope.map.addMarker({lat:self.event.location[1], lng:self.event.location[0], center:true});

        var i;
        for(i = 0; i < self.event.cars.length; i++) {
          if( self.event.cars[i].location ){
            $scope.map.addMarker({lat:self.event.cars[i].location[1], lng:self.event.cars[i].location[0]});
          }
        }
        
        self.event.date = moment(response.data.datetime).format('MMM. d, YYYY  H:mm a' );
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
      // var myLatLng = {lat: this.event.location[1],lng: this.event.location[0]};
      // var options = {
      //     center: new google.maps.LatLng(this.event.location[1], this.event.location[0]),
      //     zoom: 13,
      //     disableDefaultUI: true,
      //     draggable: true
      // };
      // var mapCanvas = document.getElementById("map");
      // var map = new google.maps.Map(mapCanvas, options);
      // var infowindow = new google.maps.InfoWindow();
      // var marker = new google.maps.Marker({
      //   position: myLatLng,
      //   map: map,
      //   title: ''
      // });
      // 
      // var infowindow = new google.maps.InfoWindow({
      //   content: this.event.place
      // });
      // infowindow.open(map, marker);
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
angular.module('carPoolingApp').controller('headerCtrl', function headerCtrl($scope) {
  $scope.firstName= "Victor";
  $scope.lastName= "Castrejon";
});
angular.module('carPoolingApp').controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$rootScope','$scope', '$window', 'apiservice','mapFactory'];

function homeCtrl ($rootScope, $scope, $window, apiservice, mapFactory ) {

  $scope.api = mapFactory.getApi();
  $scope.api.defaultLocation();
  $rootScope.$on('mapFactory:success', function () {
    console.log("yay!");
    $scope.api = mapFactory.getApi();
    console.log($scope.api);
  });

  apiservice.getEvents()
    .success(function(data) {
        $scope.nextEvents=data;
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
  apiservice.getPastEvents()
    .success(function(data) {
        $scope.pastEvents=data;
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
}
angular.module('carPoolingApp').controller('loginCtrl', loginCtrl);

loginCtrl.$inject = ['$scope','authservice','sessionservice','$state'];

  function loginCtrl ($scope, authservice, sessionservice, $state) {
    

    $scope.$on('event:google-plus-signin-success', function (e, authResult  ) {
      // console.log(authResult.id_token);
      authservice.login(authResult.id_token).then(function(response){
        // console.log(response.data.token);
        sessionservice.set(response.data.token).then(function(user){
          
           $state.go('home');
        });
      
      });
      
      //console.log(authResult.id_token);
    });
    $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
      // User has not authorized the G+ App!
      console.log('Not signed into Google Plus.');
    });
};
var myRoutesCtrl = angular.module('myRoutesCtrl',  ['geolocation', 'gservice']);
myRoutesCtrl.controller('myRoutesCtrl', function($scope, $http, $rootScope, geolocation, gservice) {
  
  $scope.test= "test";  
  geolocation.getLocation().then(function(data){
    // Set the latitude and longitude equal to the HTML5 coordinates
    coords = {lat:data.coords.latitude, long:data.coords.longitude};
    // Display coordinates in location textboxes rounded to three decimal points
    $scope.long = parseFloat(coords.long).toFixed(10);
    $scope.lat = parseFloat(coords.lat).toFixed(10);
    
    // gservice.refresh($scope.latitude, $scope.longitude);
  });
});
angular.module('carPoolingApp').controller('setDefaultCtrl', setDefaultCtrl);

setDefaultCtrl.$inject = ['$scope', '$window', 'apiservice'];

function homeCtrl ($scope, $window, apiservice) {
  var options = {
      center: new google.maps.LatLng(29.0821369,-110.9572747),
      zoom: 13,
      disableDefaultUI: true,
      draggable: true
  };
  var mapCanvas = document.getElementById("map");
  var map = new google.maps.Map(mapCanvas, options);

  apiservice.getEvents()
    .success(function(data) {
        $scope.nextEvents=data;
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
  apiservice.getPastEvents()
    .success(function(data) {
        $scope.pastEvents=data;
    })
    .error(function(data) {
        console.error('Error: ' + data);
    });
}
angular.module('carPoolingApp').controller('settingsCtrl', settingsCtrl);

settingsCtrl.$inject = ['$scope', 'apiservice'];

function settingsCtrl ($scope, apiservice) {

  $scope.settings = {};

    apiservice.getSettings()
        .success(function(data) {
            $scope.settings = data;
        })
        .error(function(data) {
            console.error('Error: ' + data);
        });


      $scope.saveData = function() {
        apiservice.saveSettings($scope.settings)
        .success(function(res, status) {
          if(res.ok)
             $scope.apiSuccess = true;
        })
        .error(function(data) {
            console.error('Error: ' + data);
        });
      };
}
angular
.module('map')
.directive('raoMap', function (MapFactory) {
  return {
    templateUrl: 'app/directives/map/map.tpl.html'
    link: function ($scope, $element, $atr, $ctrl) {
      $scope.on('raoMap:loadConfiguration', loadConfiguration );
      var mapCanvas,
          map;
      function loadConfiguration(e, data) {
        mapCanvas = document.getElementById("map");
        map = new google.maps.Map(mapCanvas, data);
      }
      
    },
    controller: function () {
      
    }
  }
})
.factory('MapFactory',function ($rootScope) {
  //you will build you map configuration here
  //send events to raoMap directive that a new configuration has been taken place

  function configuration(config) {
    var configuration = {
      center : new google.maps.LatLng(config.lat, config.long) || new google.maps.LatLng(29.0821369,-110.9572747);
      zoom : config.zoom || 13;
      disableDefaultUI : config.disableDefaultUI || false;
      draggable : config.draggable || false; 
    };

    $rootScope.broadcast('raoMap:loadConfiguration', configuration);
  }
  return { };
});
angular.module('carPoolingApp').factory('mapFactory', function($rootScope) {
  return {
    api: {},
    setApi: function (api) {
	    this.api = api;
      this.success();
    },
    getApi: function () {
      return this.api;
    },
    setApiMeth: function(meth) {
	    return false;
    },
    success: function () {
      //console.log("factory success!");
      $rootScope.$broadcast('mapFactory:success');	
    }
  };
})
angular.module('carPoolingApp')

.filter("onlyGoingPassengers", function() {
  return function(passengers) {
    var filtered = [];

    angular.forEach(passengers, function(p) {
      if(p.going) {
        filtered.push(p);
      }
    });

    return filtered;
  }
})
.filter("onlyBackPassengers", function() {
  return function(passengers) {
    var filtered = [];

    angular.forEach(passengers, function(p) {
      if(p.back) {
        filtered.push(p);
      }
    });

    return filtered;
  }
});
angular.module('apiservice', [])
.factory('apiservice', ['$http', apiservice]);

function apiservice($http) {
	var service = {};

	service.getEvent = function(eventId) {
		return $http.get('/api/events/' + eventId);
	};

	service.getEvents = function() {
		return $http.get('/api/events');
	};

	service.deleteEvent = function(eventId) {
		return $http.delete('/api/events/' + eventId);
	};

	service.getPastEvents = function() {
		return $http.get('/api/events/past');
	};

	service.createEvent = function(eventData) {
		return $http.post("/api/events/new", eventData);
	};

	service.signupToEvent = function(eventId) {
		return $http.put('/api/events/signup/' + eventId);
	};

	service.addCarToEvent = function(eventId, carData) {
		// This route should be:
		// POST /api/events/:eventId/car
		return $http.post('/api/events/'+eventId+'/car', carData);
	};

	service.deleteCarFromEvent = function(carData) {
		// This should be a delete
		// DELETE /api/events/:eventId/car/:carId
		return $http.post('/api/events/deletecar', carData);
	};

	service.joinCar = function(carData) {
		return $http.post('/api/events/joincar', carData);
	};

	service.leaveCar = function(carData) {
		return $http.post('/api/events/leavecar', carData);
	};

	service.addExtraCar = function(carData) {
		return $http.post('/api/events/addExtra', carData);
	};

	service.getSettings = function() {
		return $http.get('/api/settings');
	};

	service.saveSettings = function(settings) {
		return $http.post('/api/settings', settings);
	};

	service.sendMessage = function(options) {
		return $http.post('/api/events/' + options.eventId + '/car/' + options.carId + '/message', { message: options.message });
	};

	return service;
}
angular
.module('carPoolingApp')
.service('authservice', authservice);

authservice.$inject = ['$http'];

function authservice($http) {
  return {
    login: function(id_token) {
      return $http.post('/auth/google',  { id_token: id_token } );  
    },
    
  };
}
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var googleMapService = {};
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Array of locations obtained from API calls
        var locations = [];

        // Variables we'll use to help us pan to the right spot
        var lastMarker, currentSelectedMarker;

        // User Selected Location (initialize to center of America)
        var selectedLat = 29.08;
        var selectedLong = -110.985;

      
        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
        googleMapService.refresh = function(latitude, longitude, filteredResults){

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // If filtered results are provided in the refresh() call...
            if (filteredResults){

                // Then convert the filtered results into map points.
                locations = convertToMapPoints(filteredResults);

                // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
                initialize(latitude, longitude, true);
            }

            // If no filter is provided in the refresh() call...
            else {

                // Perform an AJAX call to get all of the records in the db.
                $http.get('/locations').success(function(response){

                    // Then convert the results into map points
                    locations = convertToMapPoints(response);

                    // Then initialize the map -- noting that no filter was used.
                    initialize(latitude, longitude, false);
                }).error(function(){});
            }
        };

        // Private Inner Functions
        // --------------------------------------------------------------

        // Convert a JSON of users into map points
        var convertToMapPoints = function(response){

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.length; i++) {
                var user = response[i];

                // Create popup windows for each record
                var  contentString = '<p><b>Name</b>: ' + user.name + '<br><b>Age</b>: ' + user.age + '<br>' +
                    '<b>Gender</b>: ' + user.gender + '<br><b>Favorite Language</b>: ' + user.favlang + '</p>';

                // Converts each of the JSON records into Google Maps Location format (Note Lat, Lng format).
                locations.push(new Location(
                    new google.maps.LatLng(user.location[1], user.location[0]),
                    new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    user.username,
                    user.gender,
                    user.age,
                    user.favlang
                ))
            }
            // location is now an array populated with records in Google Maps format
            return locations;
        };

        // Constructor for generic location
        var Location = function(latlon, message, username, gender, age, favlang){
            this.latlon = latlon;
            this.message = message;
            this.username = username;
            this.gender = gender;
            this.age = age;
            this.favlang = favlang
        };

        // Initializes the map
        var initialize = function(latitude, longitude, filter) {

            // Uses the selected lat, long as starting point
            var myLatLng = {lat: selectedLat, lng: selectedLong};

            // If map has not been created...
            if (!map){

                // Create a new map and place in the index.html page
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 13,
                    center: myLatLng
                });
            }

            // If a filter was used set the icons yellow, otherwise blue
            if(filter){
                icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
            }
            else{
                icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
            }

            // Loop through each location in the array and place a marker
            locations.forEach(function(n, i){
               var marker = new google.maps.Marker({
                   position: n.latlon,
                   map: map,
                   title: "Big Map",
                   icon: icon,
               });

                // For each marker created, add a listener that checks for clicks
                google.maps.event.addListener(marker, 'click', function(e){

                    // When clicked, open the selected marker's message
                    currentSelectedMarker = n;
                    n.message.open(map, marker);
                });
            });

            // Set initial location as a bouncing red marker
            var initialLocation = new google.maps.LatLng(latitude, longitude);
            var marker = new google.maps.Marker({
                position: initialLocation,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
            lastMarker = marker;

            // Function for moving to a selected location
            map.panTo(new google.maps.LatLng(latitude, longitude));

            // Clicking on the Map moves the bouncing red marker
            google.maps.event.addListener(map, 'click', function(e){
                var marker = new google.maps.Marker({
                    position: e.latLng,
                    animation: google.maps.Animation.BOUNCE,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                });

                // When a new spot is selected, delete the old red bouncing marker
                if(lastMarker){
                    lastMarker.setMap(null);
                }

                // Create a new red bouncing marker and move to it
                lastMarker = marker;
                //map.panTo(marker.position);

                // Update Broadcasted Variable (lets the panels know to change their lat, long values)
                googleMapService.clickLat = marker.getPosition().lat();
                googleMapService.clickLong = marker.getPosition().lng();
                $rootScope.$broadcast("clicked");
            });
        };

        // Refresh the page upon window load. Use the initial latitude and longitude
        google.maps.event.addDomListener(window, 'load',
            googleMapService.refresh(selectedLat, selectedLong));

        return googleMapService;
    });
angular.module('mapService', []).service('mapService', function($q){
   this.init = function(mapCanvas, searchInput) {
       var options = {
           center: new google.maps.LatLng(29.0729673, -110.95591),
           zoom: 13,
           disableDefaultUI: true,
           draggable: true   
       };
       this.map = new google.maps.Map(mapCanvas, options);
       this.autocomplete = new google.maps.places.Autocomplete(searchInput);
       this.map .controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
       this.autocomplete.bindTo('bounds', this.map);
       
       this.bounds = new google.maps.LatLngBounds();
   };
   
  
   
   this.addMarker = function(res) {
       if(this.marker) this.marker.setMap(null);
       this.marker = new google.maps.Marker({
           map: this.map,
           draggable: true,
           position: res.geometry.location,
           animation: google.maps.Animation.DROP
       });
       
       this.map.setCenter(res.geometry.location);
       this.map.setZoom(15);
       return this.marker;
   };
 
});
angular
.module('carPoolingApp')
.service('sessionservice', sessionservice);

authservice.$inject = ['$http','$localStorage'];

function sessionservice($http, $localStorage) {
  return {
    set: function(token) {
      return $http.get('/auth/me', {headers: {'Authorization': 'JWT '+ token}}).then(function(user){
        console.log(user);
        $localStorage.name = user.data.name;
        $localStorage.email = user.data.email;
        $localStorage.photo = user.data.photo;
        $localStorage.token =token;
        return user.data;
      });  
    },
    check:function() {
      if($localStorage.token){
        return true
      }else{
        return false
      }
    },
    token:function() {
      return $localStorage.token;
    },
    clear:function(){
      $localStorage.$reset();
    }
  };
}
