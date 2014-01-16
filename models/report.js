var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var Report = new Schema({
	createdAt: { type: Date, default: Date.now },
	title: String,
	description: String,
	neighborhood: String,
	place: String,
	time: {type: Date},
	latitude: Number,
	longitude: Number
});

module.exports = mongoose.model('Report', Report);