// ./api/reportAPI.js

var Report = require('./models/report');

/*
 * Routes for GETTING report(s), and creating/updating reports
 */
module.exports = function(app) {

	// Get the JSON for a particular report
	app.get('/report/:id', function(req, res) {
		//get report by id
		Report.findOne({'_id': req.params.id}, function(err, report) {
			if (err) return handleError(err);
			res.json(report);
		});
	});

	// Posting a report
	app.post('/api/report/new', function(req, res) {

		console.log("Checking if report was passed properly");
		console.log(req.param('title'));
		console.log(req.param('description'));
		console.log(req.param('place'));
		console.log(req.param('latitude'));
		console.log(req.param('longitude'));

		// create a todo, information comes from AJAX request from Angular
		Report.create({
			title 	: req.param('title'),
			body 	: req.param('body'),
			// user 	: req.user._id,
			location: { lat: req.param('lat'), lng: req.param('lng') }
		}, function(err, report) {
			if (err)
				res.send(err);

			// Send 200 OK response
			res.status(200);
			// return control to the front-end
			res.end();
		});
	});

	// Get all reports & sort them newest to oldest
	app.get('/api/report', function(req, res) {
		Report.find({'active': true})
		.populate('user')
		.sort({'date': -1})
		.exec(function(err, list) {
			res.json(list);
		});
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

//get report by id
function getReport(id) {
	var query = Report.findOne({'_id': id});
	return query;
}
