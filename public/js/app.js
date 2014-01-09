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

	var mapOptions = {
		zoom: 15,
		center: myCenter,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);

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
		console.log(latitude);
		console.log(longitude);
		infowindow.open(map,marker);
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
google.maps.event.addDomListener(window, 'load', initialize);

