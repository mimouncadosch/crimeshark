/* Module Dependencies */
var path = require('path');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes');
var api = require('./routes/api');
var app = express();

/* Configuration */
var app = express();
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + 'public/views');
// app.set('view engine', 'jade');
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
app.use(express.static(__dirname + '/public/views'));

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

/* Passport Config */
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
// Accounts database
var cloudDB = 'mongodb://mimouncadosch:believe18@mongo.onmodulus.net:27017/ge2dAsyb'; 
var localDB = 'mongodb://localhost/accounts'; 
mongoose.connect(localDB);

// routes
require('./routes')(app);

// API routes
app.post('/reports/create', api.create_report);
app.get('/reports', api.show_reports);

app.listen(app.get('port'), function(){
	console.log(("Express server listening on port " + app.get('port')))
});
