/* Controllers */
var myApp = angular.module('myApp.controllers', []);

function mainController($scope, $http, $rootScope, $location) {
        $scope.newReport = {};
        // when landing on the page, get all todos and show them
        $http.get('/reports')
        .success(function(data) {
                $rootScope.reports = data.result;
                console.log(data.result);
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
                        console.log("I'm accessing this");
                })
                .error(function(data) {
                        console.log('Error: ' + data);
                });
        };
        
        // $scope.showReports = function(){
        //         $http.get('/reports')
        //         .success(function(data){
        //                 $scope.reports = data;
        //                 console.log(data);
        //                 .error(function(data) {
        //                         console.log('Error: ' + data);
        //                 });
        //         })
        // };

}