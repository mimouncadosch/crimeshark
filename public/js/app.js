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
	when('/', {
		templateUrl: 'partials/landing.html',
		controller: 'homeController'
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