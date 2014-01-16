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
		controller: 'homeController',
	}).
	when('/register', {
		templateUrl: 'partials/register.html',
		controller: 'homeController',
	}).
	// when('/login', {
	// 	templateUrl: 'views/partials/login.html',
	// 	controller: 'homeController'
	// }).
	// when('/register', {
	// 	templateUrl: 'views/partials/register.html',
	// 	controller: 'homeController'
	// }).
	otherwise({
		redirectTo: '/view1'
	});

$locationProvider.html5Mode(true);
});