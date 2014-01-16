/* App Routing */

// Declare dependencies
var passport = require('passport');
var Account = require('../models/account');

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.render('home', { user : req.user });
    console.log(req.body.username);
    console.log(req.user);
  });

  app.get('/register', function(req, res) {
    res.render('register', { });
  });

  app.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username, phone_number: req.body.phone_number}), req.body.password, function(err, account) {
      if (err) {
        return res.render("register", {info: "Sorry. That username already exists. Try again."});
      }

      passport.authenticate('local')(req, res, function () {
        res.redirect('/');
      });
    });
  });

  app.get('/login', function(req, res) {
    res.render('login', { user : req.user });
    console.log(req.user);
  });

  app.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/',
    failureRedirect: 'login'
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


  //////// USING ANGULAR ////////
  app.post('/routess/signup', passport.authenticate('local', {
    successRedirect : '/routes/isLoggedin', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/routes/isLoggedin', isLoggedIn, function(req, res) {
    console.log('backend prof page');
    res.json(req.user);
    // get the user JSON object out of session and pass to template
  });


};

/**
 * checks if user has already been authenticated to maintain persistent sessions
 * @return {Boolean}
 */
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    else {
      console.log('user not logged in');
      res.end();
    }

    // if they aren't, redirect them to the login page
    //req.flash('notLoggedIn', 'You are no longer logged in');
    //res.redirect('/login');
    
}
