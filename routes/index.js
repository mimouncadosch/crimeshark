/*
 * GET home page.
 */
var path = require("path");

exports.map = function(req, res){
 	res.render('map');
 };

exports.home = function(req, res){
	res.render('home');
};

exports.account = function(req, res){
	res.render('account');
};