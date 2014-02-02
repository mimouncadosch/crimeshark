'use strict';

/* Services */

var myApp = angular.module('myApp.services', []);

// // If you are not logged in, this will redirect you to the signup page
// myApp.run( function($rootScope, $location, $cookieStore) {
//     // register listener to watch route changes
//     $rootScope.$on("$routeChangeStart", function(event, next, current) {
//         if (!$rootScope.user) {
//             if(!$cookieStore.get('user')) {
//                     // no logged user, we should be going to #login
//                     if (next.templateUrl == "partials/login.html" || next.templateUrl == "partials/signup.html") {
//                   // already going to #login, no redirect needed
//               } 
//               else {
//                   // not going to #login, we should redirect now
//                   $location.path( "/signup" );
//               } 
//           } 
//             // If you do have a user saved in the cookie store, then rootScope.user = cookieStore
//         } 
//         else {
//             $rootScope.user = $cookieStore.get('user');
//         }
//     });
// });

// myApp.run (function($rootScope, $location, $http) {
//     $rootScope.$on("$routeChangeStart", function(event, next, current) {
//         if (!$rootScope.user) {
//             if (next.templateUrl == "partials/login.html" || next.templateUrl == "partials/signup.html") {
//             } else {
//                 $http({
//                     method: 'GET',
//                     url: '/api/isLoggedin'
//                 }).success(function (data, status, headers, config) {
//                     if(data) {
//                         // Saves the user to rootScope
//                         console.log('got user!');
//                         $rootScope.user = data;
//                         console.log($rootScope.user);
//                     } else {
//                         console.log('should redirect!');
//                         $location.path("/login");
//                     }
//                 }).error(function (data, status, headers, config) {
//                     console.log('error');
//                 });
//             }
//         }
//     });
// });

/**
 * Global Variables
 */

// Define map options
    

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
myApp.factory('ProfileMap', function($http, $rootScope, $location) {
   
    /**
    * This service simplifies the code for the map in the profile page
    */
    
    return {
        startMap: function(locations) {
            console.log("Map is being made");

            // // This is the array with the coordinates of a user's safety perimeter

            // // Retrieve points from user's safety perimeter in database
            // function createCoordinatesArray(){
            //     //var locations = $rootScope.user.perimeter;
            //     var polygonCoordinates = [];
            //         // i is each point in the locations array
            //         for (var i = 0; i < locations.length; i++){
            //             var latitude = locations[i].d;
            //             var longitude = locations[i].e;
            //             polygonCoordinates.push(new google.maps.LatLng(latitude, longitude));
            //         }
            //         return polygonCoordinates;
            // };
            
            // // Create array of tuples (latitude, longitude) of the points
            // // of a user's safety perimeter
            // var polygonCoordinates = createCoordinatesArray();
            // console.log(polygonCoordinates);

            // // Find center of polygon: find average latitude and longitude
            // var sumLatitudes = 0;
            // var sumLongitudes = 0;
            // for (var i = 0; i < polygonCoordinates.length; i++){
            //     sumLatitudes = sumLatitudes + polygonCoordinates[i].d;
            //     sumLongitudes = sumLongitudes + polygonCoordinates[i].e;
            // }
            // var averageLatitude = sumLatitudes / (polygonCoordinates.length);
            // var averageLongitude = sumLongitudes / (polygonCoordinates.length);

            // console.log(averageLatitude);
            // console.log(averageLongitude);      

            // // Draw the actual perimeter
            // var perimeter = new google.maps.Polygon({
            //     paths : polygonCoordinates,
            //     strokeOpacity: 0.8,
            //     strokeWeight: 2,
            //     fillColor: '#FF0000',
            //     fillOpacity: 0.35
            // });
            // console.log(perimeter);

            // map options
            var myOptions = {
                zoom : 12,
                center : new google.maps.LatLng(averageLatitude, averageLongitude),
                mapTypeId : google.maps.MapTypeId.ROADMAP
            };
            
            // Draw the new map
            var map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);

            // Drawing Manager configurations
            // var drawingManager = new google.maps.drawing.DrawingManager({
            //     drawingMode: google.maps.drawing.OverlayType.MARKER,
            //     drawingControl: true,
            //     drawingControlOptions: {
            //         position: google.maps.ControlPosition.TOP_CENTER,
            //         drawingModes: [ google.maps.drawing.OverlayType.POLYGON]
            //     },
            //     markerOptions: {
            //         icon: 'images/beachflag.png'
            //     },
            //     circleOptions: {
            //         fillColor: '#ffff00',
            //         fillOpacity: 1,
            //         strokeWeight: 5,
            //         clickable: false,
            //         editable: true,
            //         zIndex: 1
            //     }
            // });

            // Add Drawing Manager to map
            
            //=======================================
            //=======================================
            // In the interest of time (1/30/2014), we won't give the user the option to update his/her perimeter
            // drawingManager.setMap(map);    
            
            // // Show polygon on map
            // perimeter.setMap(map);

            // // Adjust map center around perimeter
            // var bounds = new google.maps.LatLngBounds();
            // for (var i = 0; i < polygonCoordinates.length; i++) {
            //     bounds.extend (polygonCoordinates[i]);
            // }
            // map.fitBounds(bounds);


            // // This function finds whether a report falls within a user's safety perimeter. Returns boolean
            // // In the future, send email for alert
            // function isWithinPolygon(coordinates, polygon){
            //     var isWithinPolygon = polygon.containsLatLng(coordinates);
            //     console.log("is it within polygon?");
            //     console.log(isWithinPolygon);
            //     return isWithinPolygon

            // };


            // Places markers of previous reports in database
            // function setMarkers(map){
            //     $http.get('/api/reports')
            //     .success(function(data) {
            //         var locations = data;

            //         for (var i = 0; i < locations.length; i++) {
            //             var myLatLng = new google.maps.LatLng(locations[i].latitude, locations[i].longitude);
            //             var marker = new google.maps.Marker({
            //                 position: myLatLng,
            //                 map: map,
            //             });
                        
            //             // Check if report is within perimeter, and alert is therefore necessary
            //             console.log("coordinates");
            //             console.log(myLatLng);
            //             var isWithinPolygon = google.maps.geometry.poly.containsLocation(myLatLng, perimeter);
            //             console.log("isWithinPolygon");
            //             console.log(isWithinPolygon);

            //             var contentString =  
            //                   '<div id="infoWindow">'+
            //                   '<h1>' + locations[i].name + '</h1>'+
            //                   '<h2>' + locations[i].description + '</h2>'+
            //                    '</div>';

            //             var infowindow = new google.maps.InfoWindow({
            //                 content: contentString
            //             });

            //             google.maps.event.addListener(marker, 'click', function() {
            //                 infowindow.open(map,marker);
            //             });

            //             console.log(myLatLng.d);
            //             console.log(myLatLng.e);
            //         }
            //     })     
            // };

            // // Initialize the map
            // function initialize(map_id, data) { 
            // };

            // google.maps.event.addDomListener(window, 'load', initialize);  

            // setMarkers(map);
        }
    };

});

myApp.factory('GoogleMap', function() {
    
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
        placeMarkers: function(locations, map) {

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
        drawPolygon: function(perimeter, map){
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
        }
    }
});
