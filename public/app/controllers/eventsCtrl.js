angular.module('carPoolingApp').controller('eventsCtrl', eventsCtrl);

eventsCtrl.$inject = ['$scope', '$window', 'apiservice'];

function eventsCtrl ($scope, $window, apiservice) {
  
  var options = {
      center: new google.maps.LatLng(29.0821369,-110.9572747),
      lat: 29.0821369,
      long: -110.9572747,
      zoom: 13,
      disableDefaultUI: true,
      draggable: true
  };
  MapFactory.configuration(options);
  //move this to the map directive
    mapCanvas = document.getElementById("map");
    map = new google.maps.Map(mapCanvas, options);
  
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
