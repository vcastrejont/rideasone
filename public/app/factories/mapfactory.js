angular.module('carPoolingApp').factory('mapFactory', function($rootScope) {
  return {
    api: {},
    setApi: function (api) {
	    this.api = api;
      this.success();
    },
    getApi: function () {
      return this.api;
    },
    setApiMeth: function(meth) {
	    return false;
    },
    success: function () {
      console.log("factory success!");
      $rootScope.$broadcast('mapFactory:success');	
    }
  };
})
