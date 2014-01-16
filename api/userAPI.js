// ./api/userAPI

// Load our models
var User = require('./models/user'),
Crime     = require('./models/crime');

/**
 *  Aggregation strategies:
 *  
 *  The aggregation process essentially sends a collection
 *  through a series of filters to reduce the collection to
 *  a set of meaningful data.
 */

/*
 * routes for GETTING user(s), and POSTING their info
 */
module.exports = function(app) {

	// get the JSON for a particular user
	app.get('/api/user/:id', function(req, res) {
		getUser(req.params.id)
		.exec(function(err, user) {
			console.log('hello user');
			res.json(user);
		});
	});

	// get array of all crimes a user has ever posted
	app.get('/api/user/:id/crimes', function(req, res) {
		getUser(req.params.id)
		.select('crimes')
		.exec(function(err, user) {
			res.json(user.crimes);
		});
	});
};

/////////////
// QUERIES //
/////////////


//get user by id
function getUser(id) {
	var query = User.findOne({'_id': id});
	return query;
}