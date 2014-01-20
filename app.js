/**
 * Module dependencies
 */

var express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	//api = require('./routes/api'),
	http = require('http'),
	path = require('path'),
	port        = process.env.PORT || 3000;

var app = module.exports = express();
var configDB = require('./config/database.js');

/**
 * Configuration
 */

mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport);

// all environments
app.use(express.logger('dev')); // log every request to the console
app.use(express.bodyParser()); 	// get information from html forms
app.use(express.cookieParser()); // read cookies (needed for user authorization)
//app.use(express.methodOverride()); //not sure we need this

// required for 'passport' which handles our user authorization

// session secret: used to compute the hash for a session.
// prevents session tampering
app.use(express.session({ secret: 'america'}));
app.use(passport.initialize());
app.use(passport.session()); // enables persistent login sessions

// development only
if (app.get('env') === 'development') {
	app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
	// TODO
};

/**
 * Routes
 */

// serve all asset files from necessary directories
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/partials", express.static(__dirname + "/public/partials"));
app.use("/lib", express.static(__dirname + "/public/lib"));

// load user API and pass in our express app and fully configured passport
require('./api/authenticationAPI.js')(app, passport); 
// load crime report API and pass in our express app
require('./api/reportAPI.js')(app);
// load user API and pass in our express app
require('./api/userAPI.js')(app);


// redirect all others to the index (HTML5 history)
app.all("/*", function(req, res, next) {
	res.sendfile("index.html", { root: __dirname + "/public" });
});


/**
 * Start Server
 */

//In your browser, go to http://localhost:<port>
app.listen(port);
console.log("Listening on port " + port);