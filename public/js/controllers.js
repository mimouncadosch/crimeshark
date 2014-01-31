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
			// Makes an http POST request to the backend
			// Backend receives an object, the user
			 $http({
			 	method: 'POST',
			 	url: '/api/login',
			 	params: $scope.user
			 }).success(function (data, status, headers, config) {
				
				// Eventually we want to send some flash-messages to tell the user
				// why his login went wrong.

				// Saves the user to rootScope
				$rootScope.user = data;
				console.log('redirect to profile page on the frontend');
				console.log(data);
				$location.path("/profile");
				
			}).error(function (data, status, headers, config) {
				console.log('you aren\'t authorized to view this page. please login');
				$location.path('/login');
			});
		};
	}).
controller('signupCtrl', function ($scope, $rootScope, $http, $location, SignupMap) {
		/**
		 * Sign up using name, email and password.
		 */

		//SignupMap.startMap(); 
		$scope.signup = function() {
			 // Makes an http POST request to the backend
			 //Backend recieves an object, the user
			 $scope.user.perimeter = $rootScope.coordinates;
			 $http({
			 	method: 'POST',
			 	url: '/api/signup',
			 	params: $scope.user
			 }).success(function (data, status, headers, config) {
				// Saves the user to rootScope
				$rootScope.user = data;
				console.log('redirect to profile page on the frontend');
				$location.path("/profile");
			}).error(function (data, status, headers, config) {
				console.log(data);
			});
		};
	}).
controller('profileCtrl', function ($scope, $rootScope, $http, $location, ProfileMap) {
		/**
		* Makes sure the app already recognizes the user is logged in
		* If not, it redirects to the login page
		*/

		//Makes an http GET request to the backend 
		 
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
				} else {
					console.log('should redirect!');
					$location.path("/login");
				}
			}).error(function (data, status, headers, config) {
				console.log('error');
			});
		};
		 
		
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
}).
controller('reportCtrl', function ($scope, $rootScope, $http, $location, ReportMap){
	/**
	* This controller allows users and the police to post reports.
	* Reports are sent to the backend via HTTP POST request.
	*/

	// Post request to send data to the backend
	$scope.postReport = function() {
		
		$scope.report.latitude = ReportMap.returnCoordinates().d;
		$scope.report.longitude = ReportMap.returnCoordinates().e;
		
		$http({
			method: 'POST',
			url: '/api/report/new',
			params: $scope.report
		}).success(function (data, status, headers, config) {
			console.log('New report posted');
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	$http.get('/reports')
	.success(function(data) {
		$rootScope.reports = data.result;
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

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
});



// Sources: http://snippetlib.com/google_maps/drawing_tools
