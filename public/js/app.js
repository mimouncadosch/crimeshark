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
		when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'loginCtrl'
		}).
		when('/signup', {
			templateUrl: 'partials/signup.html',
			controller: 'signupCtrl'
		}).
		when('/profile', {
			templateUrl: 'partials/profile.html',
			controller: 'profileCtrl'
		}).
		when('/report', {
			templateUrl: 'partials/report.html',
			controller: 'reportCtrl'
		}).
			otherwise({
			redirectTo: '/login'
		});

	$locationProvider.html5Mode(true);
});