angular.module('carPoolingApp').directive('mapcanvas', function(mapFactory) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div></div>',
    link: function(scope, element, attrs) {
      var myOptions = {
        zoom: 13,
        center: new google.maps.LatLng(46.87916, -3.32910),
        disableDefaultUI: true,
        draggable: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var defaultPos;
      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();
      var map = new google.maps.Map(document.getElementById(attrs.id), myOptions);
      directionsDisplay.setMap(map);
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          defaultPos = {lat: position.coords.latitude, lng: position.coords.longitude};
          map.setCenter(defaultPos);
          console.log('defaultpos: '+defaultPos.lat+", "+ defaultPos.lng);
        }, function() {
         console.log("Auto geolocation failed");
        });
      } 
      
      mapFactory.setApi({
        doSomething: function() {
          console.log("api ready");
        },
        
         addMarker : function(pos){
           var latLng = new google.maps.LatLng(pos.lat,pos.lng);
           var marker = new google.maps.Marker({
             position: latLng, 
             map: map,
             title:"Hello World!"
           });
           map.setCenter(latLng);
           map.setZoom(15);
         },
        
        showRoute: function(pointA, pointB ){
           directionsService.route({
             origin: pointA,
             destination: defaultPos,
             travelMode: google.maps.TravelMode.DRIVING
           }, function(response, status) {
             if (status == google.maps.DirectionsStatus.OK) {
             directionsDisplay.setDirections(response);
           } else {
            window.alert('Directions request failed due to ' + status);
            }
           }); 
        }
      });
    }
  };
});
