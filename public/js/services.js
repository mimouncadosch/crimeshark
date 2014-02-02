'use strict';

/* Services */

var myApp = angular.module('myApp.services', []);

// Define map options
myApp.factory('Auth', function($rootScope, $http, $location) {
    return {
        getUser: function(callback) {
            if(!$rootScope.user){
                $http({
                    method: 'GET',
                    url: '/api/isLoggedin'
                }).success(function (data, status, headers, config) {
                    if(data) {
                        // Saves the user to rootScope
                        console.log('got user!');
                        $rootScope.user = data;
                        console.log($rootScope.user);
                        callback();
                    } else {
                        console.log('should redirect!');
                        $location.path("/login");
                    }
                }).error(function (data, status, headers, config) {
                    console.log('error');
                });
            } else {
                callback();
            }
        }
    }
});

myApp.factory('ReportMap', function($http) {
	/**
	* This service simplifies the code for the reports map
	*/
    var coordinates = {};
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
    // function deleteOverlays() {
    // 	if (markersArray) {
    // 		for (var i in markersArray) {
    // 			markersArray[i].setMap(null);
    // 		}
    // 		markersArray.length = 0;
    // 	}
    // };

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

myApp.factory('GoogleMap', function($http) {
    
    return {
        createMap: function() {
            var myOptions = {
                zoom : 12,
                center : new google.maps.LatLng(40.750046, -73.992358),
                mapTypeId : google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById('map-canvas'),
                myOptions);

            function initialize(map_id, data, map){
            };
            
            return map;
        },
        createDrawingManager: function(map) {
            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.POLYGON
                    ]
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
            drawingManager.setMap(map); 
            return drawingManager;
        },
        populateMarkers: function(map) {
            var locations = [];

            var triggerMarkers = function(locations) {
                // locations is the array with the perimeter coordinates
                for (var i = 0; i < locations.length; i++) {
                    var myLatLng = new google.maps.LatLng(locations[i].latitude, locations[i].longitude);
                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                    });
                    
                    var contentString =  
                              '<div id="infoWindow">'+
                              '<h1>' + locations[i].name + '</h1>'+
                              '<h2>' + locations[i].description + '</h2>'+
                               '</div>';

                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map,marker);
                    });

                    console.log(myLatLng.d);
                    console.log(myLatLng.e);
                }
            }

            $http.get('/api/reports')
                .success(function(data, status, headers, config) {
                    triggerMarkers(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
            });
            
        }, 
        createPolygonCoordinates: function(locations){
            var polygonCoordinates = [];
            // i is each point in the locations array
            for (var i = 0; i < locations.length; i++){
                var latitude = locations[i].d;
                var longitude = locations[i].e;
                polygonCoordinates.push(new google.maps.LatLng(latitude, longitude));
            }
            return polygonCoordinates;
        },
        centerMap: function(polygonCoordinates, map){
            // Adjust map center around perimeter
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < polygonCoordinates.length; i++) {
                bounds.extend (polygonCoordinates[i]);
            }
            map.fitBounds(bounds);
        }, 
        drawPolygon: function(polygonCoordinates, map){
            // Draw the actual perimeter
            var googlePerimeter = new google.maps.Polygon({
                paths : polygonCoordinates,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });
            // Show polygon on map
            googlePerimeter.setMap(map);
        },
        deleteMarkers: function(markersArray){
            console.log("deleting markers");
            if (markersArray) {
                for (var i in markersArray) {
                    markersArray[i].setMap(null);
                }
                markersArray.length = 0;
            }
        },
        placeMarker: function(map){
            // this.deleteMarkers(markersArray);
            
            google.maps.event.addListener(map, 'click', function(event) {
                
                var marker = new google.maps.Marker({
                    map: map,
                    position: location
                });
                
                var latitude = location.lat();
                var longitude = location.lng();
                var infowindow = new google.maps.InfoWindow({
                    content: "Thanks for reporting with us"
                });
                document.getElementById("latitude").value = latitude;
                document.getElementById("longitude").value = longitude;

                infowindow.open(map,marker);

                coordinates = location;
            });
        }
    }
});
