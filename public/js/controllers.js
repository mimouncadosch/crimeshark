'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('AppCtrl', function ($scope) {

}).
controller('loginCtrl', function ($scope, $rootScope, $http, $location) {
		/**
		 * Login User with email and password
		 */
		 $scope.login = function() { 
			/**
			 * Makes an http POST request to the backend
			 * Recieves an object, the user
			 */
			 $http({
			 	method: 'POST',
			 	url: '/api/login',
			 	params: $scope.user
			 }).success(function (data, status, headers, config) {
				// Eventually we want to send some flash-messages to tell the user
				// why his login went wrong.

				// Saves the user to rootScope
				$rootScope.user = data;
				console.log('redirect to prof. frontend');
				console.log(data.name);
				$location.path("/profile");
				
			}).error(function (data, status, headers, config) {
				console.log('you aren\'t authorized to view this page. please login');
				$location.path('/login');
			});
		};
	}).
controller('signupCtrl', function ($scope, $rootScope, $http, $location) {
		//$rootScope.user = {};
		/**
		 * Sign up using name, email and password.
		 */
		 $scope.signup = function() {
			/**
			 * Makes an http POST request to the backend
			 * Recieves an object, the user
			 */
		 	$scope.user.perimeter = $rootScope.coordinates;
			$http({
				method: 'POST',
				url: '/api/signup',
				params: $scope.user
			}).success(function (data, status, headers, config) {
				// Saves the user to rootScope
				$rootScope.user = data;
				console.log('redirect to prof. frontend');
				$location.path("/profile");
			}).error(function (data, status, headers, config) {
				console.log('error');
			});
		};
	}).
controller('profileCtrl', function ($scope, $rootScope, $http, $location) {
		// Makes sure the app already recognizes the user is logged in
		// If not, it redirects to the login page
		// $rootScope.user = {};
		// console.log($rootScope.user);
		if(!$rootScope.user) {
			/**
			 * Makes an http GET request to the backend
			 */
			 $http({
			 	method: 'GET',
			 	url: '/api/isLoggedin'
			 }).success(function (data, status, headers, config) {
			 	if(data) {
					// Saves the user to rootScope
					console.log('got user!');
					$rootScope.user = data; 
					console.log($rootScope.user);

				} else {
					console.log('should redirect!');
					$location.path("/login");
				}
			}).error(function (data, status, headers, config) {
				console.log('error');
			});
		}
		$scope.logout = function() {
			$rootScope.user = null;
			$http.get('/api/logout')
			.success(function() {
				console.log('logged out');
				$location.path("/login");
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		}
		$scope.updateUser = function() {
			$http({
				method: 'POST',
				url: '/api/updateUser',
				params: $scope.user
			})
		}

		var locations = $rootScope.user.perimeter;
		// console.log(locations);

		// retrieves points from user's safety perimeter in database
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

		// new map
		var map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
	    
	    // show polygon on map
	    perimeter.setMap(map);

	    // adjust map to perimeter
	    var bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < polygonCoordinates.length; i++) {
  			bounds.extend (polygonCoordinates[i]);
		}
	    map.fitBounds(bounds);

	    function initialize(map_id, data) {	
	    };

	    google.maps.event.addDomListener(window, 'load', initialize);
}).
controller('reportCtrl', function ($scope, $rootScope, $http, $location, Data){
	$http.get('/reports')
	.success(function(data) {
		$rootScope.reports = data.result;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

    // used so user can only place one marker at a time
    var markersArray = [];

    // used for database recorded locations
    var dbMarkers = [];
    var dbWindows = [];

    // places markers of previous reports in database
    //========== This needs to go in profile controller =======//
    function setMarkers(data, map){
    	$http.get('/reports')
    	.success(function(data) {
    		var locations = data.result;
    		for (var i = 0; i < locations.length; i++) {
    			var myLatLng = new google.maps.LatLng(locations[i].latitude, locations[i].longitude);
    			var marker = new google.maps.Marker({
    				position: myLatLng,
    				map: map
    			});
    			var infowindow = new google.maps.InfoWindow({
    				content: "Gracias por reportar \n" + locations[i].title + "\n" + locations[i].description
    			});
    			console.log(myLatLng.b);
    			console.log(myLatLng.d);
    		}
    	})     
    };

    // map options
    var myOptions = {
    	zoom : 12,
    	center : new google.maps.LatLng(40.750046, -73.992358),
    	mapTypeId : google.maps.MapTypeId.ROADMAP
    };

    // new map
    var map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);

    // initialize map
    function initialize(map_id, data) {   
    	google.maps.event.addListener(map, 'click', function(event) {
    		placeMarker(event.latLng);
    	});
        //     google.maps.event.addListener(marker, 'mouseover', function() {
        //         infowindow.open(map, marker);
        // }); 

            // places markers of previous reports in database
            setMarkers(data, map);
            // console.log(dbMarkers);
            // console.log(dbWindows);
        };

    // places infowindows on markers
    // function setWindows(map){
    //         console.log(dbMarkers);
    //         console.log(dbWindows);
    // };


    // delete old marker when new one placeds
    function deleteOverlays() {
    	if (markersArray) {
    		for (var i in markersArray) {
    			markersArray[i].setMap(null);
    		}
    		markersArray.length = 0;
    	}
    };

    // user-placed marker
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
}).
controller('perimeterCtrl', function ($scope, $rootScope, $http, $location, Data){
	var mapOptions = {
		center: new google.maps.LatLng(40.750046, -73.992358),
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);
	var drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.MARKER,
		drawingControl: true,
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER,
			drawingModes: [
			// google.maps.drawing.OverlayType.MARKER,
			// google.maps.drawing.OverlayType.CIRCLE,
			google.maps.drawing.OverlayType.POLYGON
			// google.maps.drawing.OverlayType.POLYLINE,
			// google.maps.drawing.OverlayType.RECTANGLE
			]
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

	drawingManager.setMap(map);	

	//Leave emtpy
	function initialize(map_id, data, map){
	};
	
	
	google.maps.event.addDomListener(window, 'load', initialize);

	function addPolygonListener(){
		google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
			var coordinates = (polygon.getPath().getArray());
			$rootScope.coordinates = coordinates;
		});
	};
	
	var polygonPerimeter = addPolygonListener();	
	// = polygonPerimeter;
//	console.log(polygonPerimeter);
}).
controller('reportCtrl', function ($scope, $rootScope, $http, $location) {
	$scope.postReport = function() {
		$http({
			method: 'POST',
			url: '/api/report/new',
			params: $scope.report
		}).success(function (data, status, headers, config) {
			console.log('new report posted');
			//console.log($rootScope.user);
			$location.path('/profile');
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};
});


// Sources: http://snippetlib.com/google_maps/drawing_tools
