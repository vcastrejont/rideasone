angular.module('carpoolingVan')

.factory('geolocationSocket', function(socketFactory, serverUrl, mapFactory,
  $ionicPlatform, authFactory) {

  var $scope,
  socket,
  socketUser,
  socketRouteId,
  driverMarker,
  connected = false;

  return {
    open: open,
    shareDriverLocation: shareDriverLocation,
    connected: connected
  };

  function open(routeId) {
    if(!routeId) return;

    socketUser = { id: authFactory.session().uid };
    socketRouteId = routeId;

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
        routeId: socketRouteId
      });
    });

    socket.on('driver location updated', function (driver) {
      updateDriverLocation(driver);
    });

    return socket;
  }

  function shareDriverLocation() {
    if(!socket) return;

    mapFactory.getGeolocation().then(function(position) {
      socketUser.location = {
        latitude: position.latitude,
        longitude: position.longitude
      };

      socket.emit("update driver location", {
        user: socketUser,
        routeId: socketRouteId
      });
    }, function(err) {
      alert(err);
    });
  }

  function updateDriverLocation(driver) {
    if(driver.location && driver.location.latitude &&
    driver.location.longitude) {
      if(driverMarker) {
        mapFactory.clearMarker(driverMarker);
      }

      var latLng = new google.maps.LatLng(driver.location.latitude,
      driver.location.longitude);

      driverMarker = mapFactory.addMarker(latLng);
    }
  }
});
