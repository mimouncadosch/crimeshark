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
 // var http = require('http');
 var auth = require('./authentication.js');

var cloudDB = 'mongodb://mimouncadosch:believe18@mongo.onmodulus.net:27017/ge2dAsyb'; 
var localDB = 'mongodb://localhost/users'; 

// connect to the database
mongoose.connect(cloudDB);

var app = express();

/**
 * Configuration
 */

// all environments
// app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser()); 	
app.use(express.methodOverride()); 	
app.use(express.cookieParser('your secret here'));
app.use(express.session({
	secret: 'mi secreto'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// serve all asset files from necessary directories
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/partials", express.static(__dirname + "/public/partials"));
app.use("/lib", express.static(__dirname + "/public/lib"));

// development only
if (app.get('env') === 'development') {
	app.use(express.errorHandler());
}
// production only
if (app.get('env') === 'production') {
	// TODO
};

// seralize and deseralize
passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user._id)
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        console.log(user)
        if(!err) done(null, user);
        else done(err, null)  
    })
});

/**
 * Routes
 */

// user routes
app.get("/", function(req, res) {
	res.sendfile("home.html", { root: __dirname + "/public" });
});
app.get('/home', routes.home);
app.post('/reports/create', api.create_report);
app.get('/reports', api.show_reports);
app.get('/account', ensureAuthenticated, function(req, res){
	User.findById(req.session.passport.user, function(err, user) {
		if(err) {
			console.log(err);
		} else {
			res.render('account', { user: user});
		};
	});
});

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


// Twitter authentication routing
app.get('/auth/twitter',
	passport.authenticate('twitter'),
	function(req, res){
	});
app.get('/auth/twitter/callback',
	passport.authenticate('twitter', { failureRedirect: '/' }),
	function(req, res) {
		res.redirect('/account.html');
	});


// port
app.listen(1337);

// test authentication
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/')
}

// start server
 // http.createServer(app).listen(app.get('port'), function () {
 // 	console.log('Express server listening on port ' + app.get('port'));
 // });



module.exports = app

// Sources: 
// http://mherman.org/blog/2013/11/10/social-authentication-with-passport-dot-js/
// https://github.com/mjhea0/passport-google-openid
