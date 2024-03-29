// ./api/userAPI

// Load our models
var User = require('./models/user');
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

	// get array of all reports a user has ever posted
	app.get('/api/user/:id/reports', function(req, res) {
		getUser(req.params.id)
		.select('reports')
		.exec(function(err, user) {
			res.json(user.reports);
		});
	});

	app.post('/api/updateUser', function (req, res, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists

        User.findOne({'_id': req.user.id}, function(err, user) {
            // if there are any errors, return the error
            if (err)
                
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                user.name = req.param('name');
            	user.phone = req.param('phone');
                user.local.email = req.param('email');
                // No option to change password yet //
                
                var perimeter = req.param('perimeter');
                console.log("PERIMETER");
                console.log(perimeter);
                if(perimeter) { 
                    var parsedPerimeter = [];
                    for (var i = perimeter.length - 1; i >= 0; i--) {
                        console.log(perimeter[i]);
                        console.log(JSON.parse(perimeter[i]));
                        parsedPerimeter.push(JSON.parse(perimeter[i]));
                    };
                    user.perimeter = parsedPerimeter;
                    // newUser.perimeter = JSON.parse(req.param('perimeter')) 
                };
                // JSON.parse()
                // user.name = req.param('name');
                // user.phone = req.param('phone');
                // // newUser.contact = JSON.parse(req.param('contact'));
                // user.perimeter = req.param('perimeter');

                // // if(perimeter) { 
                // //     var parsedPerimeter = [];
                // //     for (var i = perimeter.length - 1; i >= 0; i--) {
                // //         console.log(perimeter[i]);
                // //         console.log(JSON.parse(perimeter[i]));
                // //         parsedPerimeter.push(JSON.parse(perimeter[i]));
                // //     };
                // //     user.perimeter = parsedPerimeter;
                // //     // newUser.perimeter = JSON.parse(req.param('perimeter')) 
                // // };
                // newUser.local.email     = email;
                //newUser.hashPassword(password);

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }

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