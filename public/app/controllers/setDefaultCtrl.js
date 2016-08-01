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
