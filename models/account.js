var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    email: String,
    phone_number: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);