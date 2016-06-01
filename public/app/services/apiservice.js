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

	service.shareEvent = function(eventId, data) {
		return $http.post('/api/events/share/' + eventId, data);
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

	service.addCarToEvent = function(carData) {
		// This route should be:
		// POST /api/events/:eventId/car
		return $http.post('/api/events/addcar', carData);
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

	return service;
}
