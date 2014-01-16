// ./api/crimeAPI.js

var Crime = require('./models/crime');

/*
 * routes for GETTING crime(s), and creating/updating crimes
 */
module.exports = function(app) {

	//get the JSON for a particular crime
	app.get('/crime/:id', function(req, res) {
		//get crime by id
		Crime.findOne({'_id': req.params.id}, function(err, crime) {
			if (err) return handleError(err);
			res.json(crime);
		});
	});

	// post an crime for exchange
	app.post('/api/crime/new', function(req, res) {
		// create a todo, information comes from AJAX request from Angular
		Crime.create({
			title 	: req.param('title'),
			body 	: req.param('body'),
			user 	: req.user._id,
			location: { lat: req.param('lat'), lng: req.param('lng') }
		}, function(err, crime) {
			if (err)
				res.send(err);

			// Send 200 OK response
			res.status(200);
			// return control to the front-end
			res.end();
		});
	});

	// Get all crimes & sort them newest to oldest
	app.get('/api/crime', function(req, res) {
		Crime.find({'active': true})
		.populate('user')
		.sort({'date': -1})
		.exec(function(err, list) {
			res.json(list);
		});
	});

	// search only prints out all crimes currently
	// will need to implement some search algorithm
	// via mongodb's map reduce, or aggregation pipeline
	app.post('/api/search', function(req, res) {
		// Req object has param query
		console.log('param: ' + req.param('query'));

		Crime.find({}, function(err, list) {
			res.json(list);
		});
	});

};

//get crime by id
function getCrime(id) {
	var query = Crime.findOne({'_id': id});
	return query;
}
