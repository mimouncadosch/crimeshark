'use strict';

/* Services */

var myApp = angular.module('myApp.services', []);

myApp.factory('Data', function() {
    return {message: "I'm data from a service"}
});

myApp.factory('GoogleMaps', function($http) {
	
    // Define map options
    var myOptions = {
    	zoom : 12,
    	center : new google.maps.LatLng(40.750046, -73.992358),
    	mapTypeId : google.maps.MapTypeId.ROADMAP
    };

	// Create new map
    var map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);

    // Initialize the map
    function initialize(map_id, data) {   
    	google.maps.event.addListener(map, 'click', function(event) {
    		placeMarker(event.latLng);
    	});
    };

	// Array used so user can only place one marker at a time
    var markersArray = [];

    // Delete the old marker when the user places a new one
    function deleteOverlays() {
    	if (markersArray) {
    		for (var i in markersArray) {
    			markersArray[i].setMap(null);
    		}
    		markersArray.length = 0;
    	}
    };

    // Enables users to place a marker where the report happened
    function placeMarker(location) {
    	deleteOverlays();

    	var marker = new google.maps.Marker({
    		map: map,
    		position: location
    	});

    	markersArray.push(marker);

    	var latitude = location.lat();
    	var longitude = location.lng();
    	var infowindow = new google.maps.InfoWindow({
    		content: "Thanks for reporting with us"
    	});
    	document.getElementById("latitude").value = latitude;
    	document.getElementById("longitude").value = longitude;

    	infowindow.open(map,marker);
    };

	google.maps.event.addDomListener(window, 'load', initialize);

});