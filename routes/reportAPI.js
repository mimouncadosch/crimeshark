/* This file contains the API for creating reports */

// Declare dependencies
var path = require('path');
var mongoose = require('mongoose');
var queryString = require('querystring');
var request = require('request');

// Import Report model
var Report = require('../models/report');

// Configuration with mongoose
var cloudDB = 'mongodb://mimouncadosch:believe18@mongo.onmodulus.net:27017/g5ytyWaz'; 
var localDB = 'mongodb://localhost/reports';
mongoose.createConnection(localDB);

// To Do: Write a function that determines the neighborhood and place based on the latitude and longitude
// exports.create_crime

// Creates report
exports.create_report = function(req, res){
	console.log("I'm in the create_report'");
	console.log(objParams);
	
	var query = req._parsedUrl.query;
	var objParams = queryString.parse(query);
	var title = objParams.title;
	var description = objParams.description;
	var place = objParams.place;
	var latitude = objParams.latitude;
	var longitude = objParams.longitude; 
	
	Report.create({
		title: title,
		description: description,
		place : place,
		latitude : latitude,
		longitude: longitude
	}, function(err,report) {
		if (err)
			res.send(err);
		Report.find(function(err, reports){
			if(err)
				res.send(err);
			res.json(reports);
		});
	});                
};

// Shows reports
exports.show_reports = function(req, res){
	Report.find(function(err, result) {
		if(err) {
			return handleError(err);
		} else {
			return res.json({
				result: result,
				count: result.length
			});
		}
	});
};