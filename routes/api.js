//The API of your application

/**
 * This function is called when the app makes an http GET request to /api/getHere
 * @see app.js, line 25
 */
/*
 * Serve JSON to our AngularJS client
 */

var mongoose = require('mongoose');
var queryString = require('querystring');
var request = require('request');

var mongourl = process.env.MONGOLAB_URI || 
  'mongodb://mimouncadosch:believe18@mongo.onmodulus.net:27017/g5ytyWaz' || 
  'mongodb://localhost/reports'; 
var localDB = 'mongodb://localhost/reports'; 
mongoose.connect(localDB);
var db = mongoose.connection;

var reportSchema = mongoose.Schema({
	createdAt: { type: Date, default: Date.now },
	title: String,
	description: String,
	neighborhood: String,
	place: String,
	time: {type: Date},
	latitude: Number,
	longitude: Number
});

var Report = db.model('Report', reportSchema);

// Write a function that determines the neighborhood and place based on the latitude and longitude
// exports.create_crime

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
}




