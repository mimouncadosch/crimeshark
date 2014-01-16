var passport = require('passport');
var Account = require('./models/account');

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.render('index', { user : req.user });
  });

  app.get('/register', function(req, res) {
    res.render('register.html', { });
  });

  app.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
      if (err) {
        return res.render('register.html', { account : account });
      }

      passport.authenticate('local')(req, res, function () {
        res.redirect('/');
      });
    });
  });

  app.get('/login', function(req, res) {
    res.render('login.html', { user : req.user });
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/ping', function(req, res){
    res.send("pong!", 200);
  });

  app.get('/home', function(req, res){
    res.render("/home.html");
  });

  app.get('/map', function(req, res){
    res.render("/map.html");
  });

  app.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
      if (err) {
        return res.render("register", {info: "Sorry. That username already exists. Try again."});
      }

      passport.authenticate('local')(req, res, function () {
        res.redirect('/');
      });
    });
  });

};