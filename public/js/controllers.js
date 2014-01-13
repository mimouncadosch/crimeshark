/* Controllers */
var myApp = angular.module('myApp.controllers', []);

function mainController($scope, $http, $rootScope, $location, Data) {
        $scope.newReport = {};
        $http.get('/reports')
        .success(function(data) {
                $rootScope.reports = data.result;
                console.log(data.result[32].latitude);
        })
        .error(function(data) {
                console.log('Error: ' + data);
        });

        // when submitting the add form, send the text to the node API
        $scope.createReport = function() {
                var real_report = {
                        title: $scope.title,
                        description: $scope.description,
                        place: $scope.place,
                        latitude: latitude.value,
                        longitude: longitude.value
                };
                console.log(real_report.title);
                console.log(real_report.description);
                console.log(real_report.place);
                console.log(real_report.latitude);
                console.log(real_report.longitude);
                $http({
                        method: 'POST',
                        url: '/reports/create',
                        params: real_report
                }).
                success(function(data) {
                        $rootScope.newReport = $scope.data;
                        console.log("Successful report");
                })
                .error(function(data) {
                        console.log('Error: ' + data);
                });
        };
}

function mapController($scope, $http, $rootScope, Data){
        $http.get('/reports')
        .success(function(data) {
                $rootScope.reports = data.result;
        })
        .error(function(data) {
                console.log('Error: ' + data);
        });
        // $scope.data = Data;

        // initial locations
        var beaches = [
        [ 4.599909958081556, -74.07686233520508],
        [ 4.601364378475835, -74.06737804412842]
        ];
        
        // returns coordinates of reported locations
        function returnCoordinates(data, map){
                $http.get('/reports')
                .success(function(data) {
                        $rootScope.reports = data.result;
                        var locations = data.result;
                        for (var i = 0; i < locations.length; i++) {
                                console.log(i);
                                var myLatLng = new google.maps.LatLng(locations[i].latitude, locations[i].longitude);
                                console.log(locations[i].latitude);
                                console.log(locations[i].longitude);
                                var marker = new google.maps.Marker({
                                        position: myLatLng,
                                        map: map
                                });
                        }
                        return locations;
                })     
        };
        
        // used so user can only place one marker at a time
        var markersArray = [];

        // initial location
        var lat = 4.5981;
        var lng = -74.0758;

        // map options
        var myOptions = {
                zoom : 15,
                center : new google.maps.LatLng(lat, lng),
                mapTypeId : google.maps.MapTypeId.ROADMAP
        };

        // new map
        var map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);

        // initialize map
        function initialize(map_id, data) {   
                google.maps.event.addListener(map, 'click', function(event) {
                        placeMarker(event.latLng);
                });

                setMarkers(map, beaches);
                returnCoordinates(data, map);
        };

        // place initial markers on map
        function setMarkers(map, locations) {
                for (var i = 0; i < locations.length; i++) {
                        var beach = locations[i];
                        var myLatLng = new google.maps.LatLng(beach[0], beach[1]);
                        var marker = new google.maps.Marker({
                                position: myLatLng,
                                map: map
                        });
                }
        };

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
                        content: "Gracias por reportar"
                });
                document.getElementById("latitude").value = latitude;
                document.getElementById("longitude").value = longitude;
                
                var coordinates = [latitude, longitude]
                // console.log(latitude);
                // console.log(longitude);
                infowindow.open(map,marker);
                console.log("Hello I'm in Google Maps placeMarker function");
                return coordinates;
        };

        google.maps.event.addDomListener(window, 'load', initialize);
}