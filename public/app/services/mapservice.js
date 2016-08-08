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
