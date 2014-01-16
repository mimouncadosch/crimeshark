// ./api/models/user.js

// load the modules we need
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema =  new Schema({
	// GLOBALS
	firstname: String,
	lastname : String,
	// Need validation for UNI
	UNI      : String,
	// Need validation for phone #
	phone	 : String,

	// AUTHORIZATION
	local	     : {
		email    : String,
		password : String
	},
	crimes 		   : [{type: Number, ref: 'User'}]
});

// methods =============================
// check if password is valid using bcrypt
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// this method hashes the password and sets the user's password
userSchema.methods.hashPassword = function(password) {
	var user = this;

	// hash the password
	bcrypt.hash(password, null, null, function(err, hash) {
		if (err)
			return next(err);

		user.local.password = hash;
	});
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
