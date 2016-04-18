angular.module('carPoolingApp').directive('spinner', spinner);

spinner.$inject = ['$http' ];

function spinner($http) {
	return {
		restrict: 'E',
		template: '<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>',
		link: function(scope, element) {
			scope.loading = function() {
				return $http.pendingRequests.lenght > 0;
			}
			scope.$watch(scope.loading, function(loading) {
				if (loading) {
					element.removeClass('ng-hide');
				} else {
					element.addClass('ng-hide')
				};
			})
		}
	}
}