angular.module('userservice', [])
.factory('userservice', ['$http', userservice]);

function userservice($http) {
	var service = {};

	service.setUserLocation = function(user) {
		return $http.post('/api/users/setuserlocation', user);
	}

	return service;
}