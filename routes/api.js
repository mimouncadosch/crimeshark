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
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/reports'; 
mongoose.connect(mongourl);
var db = mongoose.connection;

var reportSchema = mongoose.Schema({
	createdAt: { type: Date, default: Date.now },
	title: String,
	description: String,
	imageURL: String,
	neighborhood: String,
	place: String,
	time: {type: Date}
});

var Report = db.model('Report', reportSchema);


exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};

// Write a function that determines the neighborhood and place based on the latitude and longitude
// exports.create_crime

exports.generate_crime = function(req, res){
	Report.create({
		title: req.body.text,
		description: req.body.text,
		imageURL: req.body.text,
		place: req.body.text,
		time: req.body.text
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
