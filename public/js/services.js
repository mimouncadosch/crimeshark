'use strict';
/* Services */

var myApp = angular.module('myApp.services', []);

myApp.factory('Data', function() {
    return {message: "I'm data from a service"}
});

myApp.factory('GoogleMaps', function($http) {
	var map_id  = '#map-canvas';
	var map     = initialize(map_id);
	// console.log(coordinates);
});
