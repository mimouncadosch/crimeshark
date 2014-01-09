'use strict';

/* Controllers */

var reports = angular.module('myApp.controllers', []);

function mainController($scope, $http) {
        $scope.formData = {};

        // when landing on the page, get all todos and show them
        $http.get('/reports/reports')
                .success(function(data) {
                        $scope.reports = data;
                })
                .error(function(data) {
                        console.log('Error: ' + data);
                });

        // when submitting the add form, send the text to the node API
        $scope.createReport = function() {
                $http.post('/reports/reports', $scope.formData)
                        .success(function(data) {
                                $('input').val('');
                                $scope.reports = data;
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };
        // // delete a todo after checking it
        // $scope.deleteReport = function(id) {
        //         $http.delete('/reports/reports/' + id)
        //                 .success(function(data) {
        //                         $scope.todos = data;
        //                 })
        //                 .error(function(data) {
        //                         console.log('Error: ' + data);
        //                 });
        // };

}