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
		/**
		 * Sign up using name, email and password.
		 */
		$scope.signup = function() {
			/**
			 * Makes an http POST request to the backend
			 * Recieves an object, the user
			 */
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
	});

	