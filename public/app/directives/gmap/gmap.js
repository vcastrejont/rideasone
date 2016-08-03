angular.module('carPoolingApp').directive('gmap', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div></div>',
    control: '=',
    link: function($scope, element, attrs) {
      local = $scope.control || {};
      var takenTablets = 0;
      local.takeTablet = function() {
        takenTablets += 1;
        console.log(takenTablets);
      }


      var defaultOptions = {
        zoom: 13,
        center: new google.maps.LatLng(29.0729673, -110.95591),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        draggable: true
      };
      var map = new google.maps.Map(document.getElementById(attrs.id), defaultOptions);

      google.maps.event.addListener(map, 'click', function(e) {
        $scope.$apply(function() {
          addMarker({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
          });
        });
      });

      addMarker = function(pos) {
          var myLatlng = new google.maps.LatLng(pos.lat, pos.lng);
          var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: "Hello World!"
          });
        } //end addMarker

    }
  };
});
