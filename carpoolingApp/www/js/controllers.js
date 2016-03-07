angular.module('carpooling.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ProfileCtrl', function($scope) {
  $scope.profile = {
    username: 'Username',
    avatar: 'avatar.jpg',
    location: {
      name: 'User location name',
      coordinates: {
        lat: 10.00000,
        lng: 9.0000000
      }
    }
  }
})

.controller('RoutesCtrl', function($scope) {

})

.controller('SearchCtrl', function($scope, $stateParams) {
})

.controller('MapCtrl', function($scope, $window, $state, $stateParams, $cordovaGeolocation, $cordovaLaunchNavigator, carpoolingData) {

  var options = { timeout: 10000, enableHighAccuracy: true };

  $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
    var currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: currentPosition,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);


    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: currentPosition
      });

      var infoWindow = new google.maps.InfoWindow({
        content: 'My position'
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open($scope.map, marker);
      });
    });
  }, function(error) {
    console.log('Could not get geolocation');
  });
})

.controller('EventCtrl', function($scope, $window, $state, $stateParams, $cordovaGeolocation, $cordovaLaunchNavigator, carpoolingData) {
  // var locationId = parseInt($stateParams.id) - 1;
  carpoolingData.forEach(function(event) {
    if (event._id === $stateParams.id) {
      $scope.event = event;
    };
  });

  var location = new google.maps.LatLng($scope.event.location[1], $scope.event.location[0]);

  var options = { timeout: 10000, enableHighAccuracy: true };

  $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
    var currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);


    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: currentPosition
      });

      var destinationMarker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: location
      });


      var infoWindow = new google.maps.InfoWindow({
        content: 'Coordinates: ' + currentPosition.lat() + ' ' + currentPosition.lng()
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open($scope.map, marker);
      });
    });

    //Get directions
    $scope.getRoute = function() {
      var directionsService = new google.maps.DirectionsService(),
        directions = new google.maps.DirectionsRenderer();

      directions.setMap($scope.map);

      var directionsData = {
        origin: currentPosition,
        destination: location,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      }

      directionsService.route(directionsData, function(res, status) {
        var route = res.routes[0];
        var leg = route.legs[0];

        directions.setDirections(res);

        $scope.route = {
          distance: leg.distance,
          duration: leg.duration
        }
      });
    }

    //Navigation help
    $scope.navigate = function() {
      if($window.cordova) {
        $cordovaLaunchNavigator.navigate(destination, currentPosition);
      } else {
        var urlScheme = "http://maps.google.com/maps?&saddr=" + currentPosition.lat() + "," + currentPosition.lng() + "&daddr=" + location.lat() + "," + location.lng();
        $window.open(urlScheme);
      }
    };

  }, function(error) {
    console.log('Could not get geolocation');
  });

  //var watchOptions = {
  //  frequency: 1000,
  //  timeout: 3000,
  //  enableHighAccuracy: false
  //};
  //
  //var watch = $cordovaGeolocation.watchPosition(watchOptions);
  //
  //watch.then(function(position) {
  //  var lat = position.coords.latitude,
  //      lng = position.coords.longitude,
  //      currentLocation = new google.maps.LatLng(lat, lng);
  //
  //      currentPosMarker.setPosition(currentLocation);
  //}, function(error) {
  //  alert('Geoposition error');
  //});

})

.controller('EventsCtrl', function($scope, carpoolingData) {
  $scope.events = carpoolingData;
})

.controller('SettingsCtrl', function($scope) {

})

.controller('LoginCtrl', function($scope, $http, $location, $cordovaInAppBrowser, $rootScope) {
    var callbackURI = "http://localhost:3000/auth/google/callback",
        backendRoute = "http://localhost:3000/#/";

    $scope.login = function() {
        var ref = $cordovaInAppBrowser.open(
          'https://accounts.google.com/o/oauth2/auth?client_id=' + clientId +
          '&redirect_uri=' + callbackURI +
          '&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile' +
          '&approval_prompt=force&response_type=code&access_type=offline',
          '_blank');

        $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event) {
          if(event.url === backendRoute) {
              $cordovaInAppBrowser.close();
          }
        });

        $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event) {
          $route.reload();
        });
    };
});
