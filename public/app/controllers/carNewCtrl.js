/* globals angular, google */
angular.module('carPoolingApp').controller('carNewCtrl', carNewCtrl);

carNewCtrl.$inject = ['$q', '$state', 'apiservice'];

function carNewCtrl ($q, $state, apiservice) {
  var vm = this;
  var map = null;
  var eventMarker = null;
  // TODO: I'm hardcoding these coordinates because the event returns coordinates for antartica
  var eventLatLng = new google.maps.LatLng(29.07823509999999, -110.9467113);
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  vm.isRoundTrip = false;
  vm.departureTime = null;
  vm.returnTime = null;
  vm.departureTrip = {};
  vm.returnTrip = {};
  vm.event = {
    _id: $state.params.eventId
  };

  initializeUI();
  initializeEvent();

  function initializeUI () {
    // Get UI elements
    var departureInput = document.getElementById('departure');
    var returnInput = document.getElementById('return');
    var mapContainer = document.getElementById('mapContainer');

    // Get the map
    map = new google.maps.Map(mapContainer, {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 13,
      center: new google.maps.LatLng(29.0729673, -110.95591),
      disableDefaultUI: true,
      // scaleControl: false,
      draggable: false,
      scrollwheel: false
    });

    console.log(departureInput);
    // Initialize autocomplete functionality
    var departureBox = new google.maps.places.SearchBox(departureInput);
    var returnBox = new google.maps.places.SearchBox(returnInput);

    // Set search bounds
    map.addListener('bounds_changed', function () {
      var bounds = map.getBounds();
      departureBox.setBounds(bounds);
      returnBox.setBounds(bounds);
    });

    // Attach autocomplete events
    // TODO: Merge duplicated code. Sorry about that.
    departureBox.addListener('places_changed', function () {
      var selectedPlaces = departureBox.getPlaces();
      if (selectedPlaces.length > 0) {
        var selected = selectedPlaces[0];
        vm.departureTrip.place = selected.name;
        vm.departureTrip.place_id = selected.place_id;
        vm.departureTrip.address = selected.formatted_address;
        vm.departureTrip.location = [selected.geometry.location.lat(), selected.geometry.location.lng()];
        // Delete event marker
        eventMarker.setMap(null);
        eventMarker = null;
        // Render directions
        renderDirections(selected.geometry.location, eventLatLng);
        centerMapForLocations(map, [selected.geometry.location, eventLatLng]);
      }
    });

    returnBox.addListener('places_changed', function () {
      var selectedPlaces = returnBox.getPlaces();
      if (selectedPlaces.length > 0) {
        var selected = selectedPlaces[0];
        vm.returnTrip.place = selected.name;
        vm.returnTrip.place_id = selected.place_id;
        vm.returnTrip.address = selected.formatter_address;
        vm.returnTrip.location = [selected.geometry.location.lat(), selected.geometry.location.lng()];
      }
    });
  }

  function initializeEvent () {
    apiservice.getEvent(vm.event._id).then(function (response) {
      vm.event = response.data;
      eventMarker = new google.maps.Marker({
        position: eventLatLng,
        title: vm.event.place
      });
      eventMarker.setMap(map);
      console.log(eventLatLng);
      centerMapForLocations(map, [eventLatLng]);
    });
  }

  function centerMapForLocations (map, locations) {
    var bounds = new google.maps.LatLngBounds();
    locations.forEach(function (loc) {
      bounds.extend(loc);
    });

    map.fitBounds(bounds);
    map.panToBounds(bounds);

    google.maps.event.addListenerOnce(map, 'idle', function () {
      map.setZoom(map.getZoom() - 1);
      map.panBy(-200, 0);
    });
  }

  function renderDirections (fromPosition, toPosition) {
    directionsService.route({
      origin: fromPosition,
      destination: toPosition,
      travelMode: google.maps.TravelMode.DRIVING
    }, function (result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
        directionsDisplay.setMap(map);
      }
    });
  }

  function getValidationError () {
    if (!vm.departureTrip.place) return { message: 'Please select a departure place' };
    if (!vm.departureTrip.seats) return { message: 'Select the available seats for departure trip' };
    if (!vm.departureTrip.time) return { message: 'Please set a departure time' };
    if (vm.isRoundTrip) {
      if (!vm.departureTrip.time) return { message: 'Please select a place to return' };
      if (!vm.departureTrip.time) return { message: 'Select the available seats for the return trip' };
      if (!vm.departureTrip.time) return { message: 'Please set a return time' };
    }
    return null;
  }

  vm.departureTimeChanged = function () {
    var eventDate = new Date(vm.event.datetime);
    var departureDate = new Date(vm.departureTime);
    vm.departureTrip.time = new Date(
      eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(),
      departureDate.getHours(), departureDate.getMinutes(), 0
    );
  };

  vm.dismissError = function () {
    vm.error = null;
  };

  vm.submit = function () {
    var error = getValidationError();
    vm.error = error;
    if (error) return;

    apiservice.addCarsToEvent(vm.event.id, [vm.departureTrip, vm.returnTrip]).then(function (response) {
      // TODO: Car saved. Go home. (You're drunk).
    }, function (response) {
      if (response.error) {
        vm.error = error;
      }
    });
  };
}
