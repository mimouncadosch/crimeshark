/* Module Dependencies */
var path = require('path');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var routes = require('./routes/authAPI');
var api = require('./routes/reportAPI');
var engines = require('consolidate');
var User = require('./models/user');
var app = express();

/* Configuration */
var app = express();
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/public/views');
app.set('view options', { layout: false });
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use("/partials", express.static(__dirname + "/public/partials"));

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

/* Passport Config */
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// mongoose
// Users database
var cloudDB = 'mongodb://mimouncadosch:believe18@mongo.onmodulus.net:27017/ge2dAsyb'; 
var localDB = 'mongodb://localhost/users'; 
mongoose.connect(localDB);

// routes
require('./routes/authAPI')(app, passport);

// API routes
app.post('/reports/create', api.create_report);
app.get('/reports', api.show_reports);

app.listen(app.get('port'), function(){
	console.log(("Express server listening on port " + app.get('port')))
});