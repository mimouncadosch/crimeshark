'use strict';

/* Services */

var myApp = angular.module('myApp.services', []);

myApp.factory('Data', function() {
    return {message: "I'm data from a service"}
});

myApp.factory('ReportMap', function($http) {
	/**
	* This service simplifies the code for the reports map
	*/

    var coordinates = {};

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

        coordinates = location;
    };

    // Initialize the map

    google.maps.event.addDomListener(window, 'load', initialize);

    // Returns the coordinates of the report
    return {
        returnCoordinates: function () {
            return coordinates;
        }
    };

});
myApp.factory('ProfileMap', function($http) {
   
    /**
    * This service simplifies the code for the map in the profile page
    */
    console.log("Map is being made");
    // This function makes the map in the profile page, 
    // once the data from the backend is loaded


        // This is the array with the coordinates of a user's safety perimeter
        var locations = $rootScope.user.perimeter;

        // Retrieve points from user's safety perimeter in database
        function createCoordinatesArray(){
            var polygonCoordinates = [];
                // i is each point in the locations array
                for (var i = 0; i < locations.length; i++){
                    var latitude = locations[i].d;
                    var longitude = locations[i].e;
                    polygonCoordinates.push(new google.maps.LatLng(latitude, longitude));
                }
                return polygonCoordinates;
        };
        
        // Create array of tuples (latitude, longitude) of the points
        // of a user's safety perimeter
        var polygonCoordinates = createCoordinatesArray();
        console.log(polygonCoordinates);

        // Find center of polygon: find average latitude and longitude
        var sumLatitudes = 0;
        var sumLongitudes = 0;
        for (var i = 0; i < polygonCoordinates.length; i++){
            sumLatitudes = sumLatitudes + polygonCoordinates[i].d;
            sumLongitudes = sumLongitudes + polygonCoordinates[i].e;
        }
        var averageLatitude = sumLatitudes / (polygonCoordinates.length);
        var averageLongitude = sumLongitudes / (polygonCoordinates.length);

        console.log(averageLatitude);
        console.log(averageLongitude);      

        // Draw the actual perimeter
        var perimeter = new google.maps.Polygon({
            paths : polygonCoordinates,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        console.log(perimeter);

        // map options
        var myOptions = {
            zoom : 12,
            center : new google.maps.LatLng(averageLatitude, averageLongitude),
            mapTypeId : google.maps.MapTypeId.ROADMAP
        };
        
        // Draw the new map
        var map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);

        // Drawing Manager configurations
        var drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [ google.maps.drawing.OverlayType.POLYGON]
            },
            markerOptions: {
                icon: 'images/beachflag.png'
            },
            circleOptions: {
                fillColor: '#ffff00',
                fillOpacity: 1,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1
            }
        });

        // Add Drawing Manager to map
        drawingManager.setMap(map);    
        
        // Show polygon on map
        perimeter.setMap(map);

        // Adjust map center around perimeter
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < polygonCoordinates.length; i++) {
            bounds.extend (polygonCoordinates[i]);
        }
        map.fitBounds(bounds);

        // Initialize the map
        function initialize(map_id, data) { 
        };

        google.maps.event.addDomListener(window, 'load', initialize);

});