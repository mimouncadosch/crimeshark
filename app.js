// Source: http://mherman.org/blog/2013/11/10/social-authentication-with-passport-dot-js/
/**
 * Module dependencies
 */

 var fs = require('fs');
 var express = require('express');
 var routes = require('./routes');
 var path = require('path');
 var api = require('./routes/api');
 var config = require('./oauth.js');
 var User = require('./models/user.js');
 var mongoose = require('mongoose');
 var passport = require('passport');
 var http = require('http');
 var auth = require('./authentication.js');

// connect to the database
mongoose.createConnection('mongodb://localhost/users');

var app = module.exports = express();

/**
 * Configuration
 */

// // all environments
// app.set('port', process.env.PORT || 3000);
// app.use(express.logger('dev'));
// app.use(express.bodyParser()); 	
// app.use(express.methodOverride()); 	
// app.use(express.cookieParser('your secret here'));
// app.use(express.session())
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', __dirname + '/views');
// app.engine('html', require('ejs').renderFile);


app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'html');
	app.engine('html', require('ejs').renderFile);
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'my_precious' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if (app.get('env') === 'development') {
	app.use(express.errorHandler());
}
// production only
if (app.get('env') === 'production') {
	// TODO
};

// serialize and deserialize
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

/**
 * Routes
 */

// serve all asset files from necessary directories
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/partials", express.static(__dirname + "/public/partials"));
app.use("/lib", express.static(__dirname + "/public/lib"));


// Google authentication routing
app.get('/auth/google', 
	passport.authenticate('google', {scope:'email'}),
	function(req, res){
	});
app.get('/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/' }),
	function(req, res) {
		res.redirect('/account.html');
	});
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});


// user routes
app.get('/', routes.index);
app.get('/home', routes.home);
app.post('/reports/create', api.create_report);
app.get('/reports', api.show_reports);
app.get('/account', ensureAuthenticated, function(req, res){
	User.findById(req.session.passport.user, function(err, user) {
		if(err) {
			console.log(err);
		} else {
			res.render('account.html', { user: user});
		};
	});
});

// Twitter authentication routing
app.get('/auth/twitter',
	passport.authenticate('twitter'),
	function(req, res){
	});
app.get('/auth/twitter/callback',
	passport.authenticate('twitter', { failureRedirect: '/' }),
	function(req, res) {
		res.redirect('/account');
	});

//

// test authentication
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/')
}

/**
 * Start Server
 */
 http.createServer(app).listen(app.get('port'), function () {
 	console.log('Express server listening on port ' + app.get('port'));
 });


 module.exports = app