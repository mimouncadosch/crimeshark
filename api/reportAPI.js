// ./api/reportAPI.js

var Report = require('./models/report');
var User = require('./models/user');

/*
 * Routes for GETTING report(s), and creating/updating reports
 */
module.exports = function(app) {

	var name = "Mimoun";
	var usersList;
	User.find({})
		.exec(function(err, list) {
			usersList = list;
		});

	// Get the JSON for a particular report
	app.get('/report/:id', function(req, res) {
		//get report by id
		Report.findOne({'_id': req.params.id}, function(err, report) {
			if (err) return handleError(err);
			res.json(report);
		});
	});

	// Posting a new report and checking whether it falls within a user's safety perimeter
	app.post('/api/report/new', function(req, res) {
		// console.log("Checking if report was passed properly");
		// console.log(req.param('name'));
		// console.log(req.param('description'));
		// console.log(req.param('place'));
		// console.log(req.param('latitude'));
		// console.log(req.param('longitude'));

		// create a report, information comes from AJAX request from Angular
		Report.create({
			name 	: req.param('name'),
			description 	: req.param('description'),
			place 	: req.param('place'),
			latitude: req.param('latitude'),
			longitude :req.param('longitude')
		}, function(err, report) {
			if (err)
				res.send(err);
			// Send 200 OK response
			res.status(200);
			// return control to the front-end
			res.end();
		});

		
		// When a new report is created, loop through each user's safety perimeter to see if this report falls within his or her safety area
		console.log("Report has been created!");
		
		// Loop through list of users
		for (var i = 0; i < usersList.length; i++) {
			

			var user = usersList[i];
			
			// Arrays with the latitude & longitude coordinates for a user's safety perimeter
			var latitudes = [];
			var longitudes = [];

			// Loop through each user's perimeter coordinates and add all the latitudes in the latitudes array
			for (var i = 0; i < user.perimeter.length; i++) {
				latitudes.push(user.perimeter[i].d);
			}
			for (var i = 0; i < user.perimeter.length; i++) {
				longitudes.push(user.perimeter[i].e);
			}

			// Declare maximum & minimum latitudes & longitudes.
			// These values will be used to determine whether the incident happened within the safety perimeter or not 
			maxLatitude = findMax(latitudes);
			maxLongitude = findMax(longitudes);
			minLatitude = findMin(latitudes);
			minLongitude = findMin(longitudes);
			console.log(maxLatitude);
			console.log(maxLongitude);
			console.log(minLatitude);
			console.log(minLongitude);

			var inPerimeter = withinPerimeter(maxLatitude, minLatitude, maxLongitude, minLongitude, req.param('latitude'), req.param('longitude'))
			console.log(inPerimeter);

			if(inPerimeter){
				console.log("This report falls within ", user.name, "'s safety perimeter");	
			}
			else if(!inPerimeter){
				console.log("This report does not fall within ", user.name, "'s safety perimeter");		
			}
			

			// Email implementation


		};
		
	});



	// Get all reports & sort them newest to oldest
	app.get('/api/reports', function(req, res) {
		Report.find({})
		.exec(function(err, list) {
			res.json(list);
			reportsList = list;
		});
	});

	app.get('/api/reportslist', function(req, res){
		console.log(reportsList);
		res.json(reportsList);
	});

	// If a new report falls within someone's safety perimeter, send user email with alert
	app.get('/api/users/:id', function(req, res){


		// Go through a user's perimeter and find the max & min latitude and the max & min longitude 
		// getUser(req.params.id)
		// 	.exec(function(err, user) {
		// 	console.log('hello user');

		// 	var latitudes = [];
		// 	var longitudes = [];

		// 	// loop through a user's perimeter coordinates and add all the latitudes in the latitudes array
		// 	for (var i = 0; i < user.perimeter.length; i++) {
		// 		latitudes.push(user.perimeter[i].d);
		// 	}
		// 	for (var i = 0; i < user.perimeter.length; i++) {
		// 		longitudes.push(user.perimeter[i].e);
		// 	}

		// 	maxLatitude = findMax(latitudes);
		// 	maxLongitude = findMax(longitudes);
		// 	minLatitude = findMin(latitudes);
		// 	minLongitude = findMin(longitudes);

			
		// 	console.log(maxLatitude);
		// 	console.log(maxLongitude);
		// 	console.log(minLatitude);
		// 	console.log(minLongitude);

			// Report.find({})
			// .exec(function(err, list) {
			// 	res.json(list);

			// });
			// withinPerimeter(maxLatitude, minLatitude, maxLongitude, minLongitude, pointLatitude, pointLongitude)

		// });
			



	});


	app.get('/findmax', function(req, res){
		




		// var array = [10, 12, 100, 2, 32, 20, 221, 300, 400, 1000];
		// console.log(array);
		// max = findMax(array);
		// console.log(max);
		// res.json(name);
		
	});


	// search only prints out all reports currently
	// will need to implement some search algorithm
	// via mongodb's map reduce, or aggregation pipeline
	app.post('/api/search', function(req, res) {
		// Req object has param query
		console.log('param: ' + req.param('query'));

		Report.find({}, function(err, list) {
			res.json(list);
		});
	});

};



//====================================================================
//========================= HELPER FUNCTIONS =========================
//====================================================================


// Get report by id
function getReport(id) {
	var query = Report.findOne({'_id': id});
	return query;
}

// Gets all reports
function getReports() {
	var query = Report.find({});
	return query;
}

// Get all users
function getUsers() {
	var query = User.find({});
	return query;
}


// Get user by id
function getUser(id) {
	var query = User.findOne({'_id': id});
	return query;
}

// Generic function to find largest value in an array
function findMax(array) {
	var max = array[0];
	for (var i = 1; i < array.length; i++) {
		if(max < array[i]){
			max = array[i];
		}
	};	
	return max;
}

// Generic function to find smallest value in an array
function findMin(array) {
	var min = array[0];
	for (var i = 1; i < array.length; i++) {
		if(min > array[i]){
			min = array[i];
		}
	};	
	return min;
}

// This function determines whether a point is within a perimeter. 
// The perimeter is categorized by the coordinates of the max & min latitude and longitude (4 variables)
function withinPerimeter(maxLatitude, minLatitude, maxLongitude, minLongitude, pointLatitude, pointLongitude){
	var inPerimeter = false;
	if(	minLatitude <= pointLatitude 
		&& pointLatitude <= maxLatitude 
		&& minLongitude <= pointLongitude
		&& pointLongitude <= maxLongitude ){

		inPerimeter = true;
		console.log("Point within Safety Perimeter");
	}
	return inPerimeter;
}