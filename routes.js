/* App Routing */

// Declare dependencies
var passport = require('passport');
var Account = require('./models/account');

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.render('home', { user : req.user });
  });

  app.get('/register', function(req, res) {
    res.render('register.html', { });
  });

  app.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
      if (err) {
        return res.render('register', { account : account });
      }

      passport.authenticate('local')(req, res, function () {
        res.redirect('/');
      });
    });
  });

  app.get('/login', function(req, res) {
    res.render('login.html', { user : req.user });
    console.log(req.body.username);
  });

  app.post('/login', passport.authenticate('local', 
  { 
    successRedirect: '/', 
    failureRedirect: '/login'
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/map', function(req, res){
    res.render("map.html");
  });

  app.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
      if (err) {
        return res.render("register.html", {info: "Sorry. That username already exists. Try again."});
      }

      passport.authenticate('local')(req, res, function () {
        res.redirect('/');
      });
    });
  });

};