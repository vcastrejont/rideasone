angular.module('carpoolingVan')

.factory('geolocationSocket', function(socketFactory, serverUrl, mapFactory,
  $ionicPlatform, authFactory) {

  var $scope,
  socket,
  socketUser,
  socketRoute,
  driverMarker,
  connected = false;

  return {
    open: open,
    shareDriverLocation: shareDriverLocation,
    stopSharingLocation: stopSharingLocation,
    redrawMarkers: redrawMarkers,
    connected: connected
  };

  function open(route) {
    if(!route) return;

    socketUser = { id: authFactory.currentUser().$id };
    socketRoute = route;

    if(!connected) {
      connectSocket();
    }

    return socket;
  }

  function connectSocket() {
    var newSocket;

    try {
      newSocket = io.connect(serverUrl);
    }
    catch(err) {
      alert(err);
      return;
    }

    socket = socketFactory({
      ioSocket: newSocket
    });

    socket.on("connect", function() {
      connected = true;

      socket.emit("add user to van", {
        user: socketUser,
        routeId: socketRoute.$id
      });
    });

    socket.on('markers redrawed', function() {
      mapFactory.setMarkers(socketRoute.passengers);
    });

    socket.on('driver location updated', function (location) {
      updateDriverLocation(location);
    });

    socket.on('driver location stopped', function () {
      if(driverMarker) {
        mapFactory.clearMarker(driverMarker);
      }
    });

    return socket;
  }

  function shareDriverLocation() {
    if(!socket) return;

    mapFactory.getGeolocation().then(function(position) {
      socket.emit("update driver location", {
        latitude: position.latitude,
        longitude: position.longitude
      });
    }, function(err) {
      alert(err);
    });
  }

  function stopSharingLocation() {
    if(!socket) return;
    socket.emit("clear driver location");
  }

  function updateDriverLocation(location) {
    if(location && location.latitude && location.longitude) {
      if(driverMarker) {
        mapFactory.clearMarker(driverMarker);
      }
      else {
        mapFactory.extendBounds(new google.maps.LatLng(location.latitude, location.longitude));
      }

      driverMarker = mapFactory.addMarker(location, "/img/van.png", "The mistery machine");
    }
  }

  function redrawMarkers() {
    if(!socket) return;
    socket.emit("redraw markers");
  }
});
