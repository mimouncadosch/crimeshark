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
controller('signupCtrl', function ($scope, $rootScope, $http, $location, GoogleMap) {
		/**
		 * Sign up using name, email and password.
		 */

		$scope.user = {};

		var map = GoogleMap.createMap();
		var drawingManager = GoogleMap.createDrawingManager(map);
		google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
            //var coordinates = [];
            var coordinates = (polygon.getPath().getArray());
            console.log(("Polygon listener being called"))
            console.log(coordinates);     
            $scope.user.perimeter = coordinates;
        })
		

		//SignupMap.startMap(); 
		$scope.signup = function() {
			 // Makes an http POST request to the backend
			 //Backend recieves an object, the user
			 console.log($scope.user.perimeter)
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
controller('profileCtrl', function ($scope, $rootScope, $http, $location, GoogleMap, ProfileMap, Auth) {
		/**
		* Makes sure the app already recognizes the user is logged in
		* If not, it redirects to the login page
		*/
		
		//Makes an http GET request to the backend 
		console.log("Profile page front-end");
		
		var map = GoogleMap.createMap();
		GoogleMap.placeMarkers(map);

		Auth.getUser(function() {
			var polygonCoordinates = GoogleMap.createPolygonCoordinates($scope.user.perimeter);
		    GoogleMap.centerMap(polygonCoordinates, map);
		    GoogleMap.drawPolygon(polygonCoordinates, map);
		});
	    
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
		$scope.report.user = $rootScope.user;
		
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

});



// Sources: http://snippetlib.com/google_maps/drawing_tools
