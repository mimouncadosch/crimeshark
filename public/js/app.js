'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
	'ngRoute',
	'myApp.controllers',
	'myApp.filters',
	'myApp.services',
	'myApp.directives'
	]).
config(function ($routeProvider, $locationProvider) {
	$routeProvider.
	when('/view1', {
		templateUrl: 'partials/partial1.html',
		controller: 'MyCtrl1'
	}).
	when('/view2', {
		templateUrl: 'partials/partial2.html',
		controller: 'MyCtrl2'
	}).
	otherwise({
		redirectTo: '/view1'
	});

	$locationProvider.html5Mode(true);
});

function initialize() {
	var myCenter = new google.maps.LatLng(4.5981,-74.0758);
	var markersArray = [];
	var beaches = [
	[ 4.599909958081556, -74.07686233520508],
	[ 4.601364378475835, -74.06737804412842]
	];

	var mapOptions = {
		zoom: 15,
		center: myCenter,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);

	setMarkers(map, beaches);

	google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng);
	});

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
			content: "Gracias por reportar"
		});
		document.getElementById("latitude").value = latitude;
		document.getElementById("longitude").value = longitude;
		infowindow.open(map,marker);

		console.log("Here's your stuff");
		console.log(data);

	}

	function deleteOverlays() {
		if (markersArray) {
			for (var i in markersArray) {
				markersArray[i].setMap(null);
			}
			markersArray.length = 0;
		}
	}
}

function setMarkers(map, locations) {
  for (var i = 0; i < locations.length; i++) {
    var beach = locations[i];
    var myLatLng = new google.maps.LatLng(beach[0], beach[1]);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
    });
  }
}

google.maps.event.addDomListener(window, 'load', initialize);