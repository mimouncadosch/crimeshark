// ./api/models/crime.js

var mongoose = require('mongoose'),
elmongo = require('elmongo'),
Schema       = mongoose.Schema,
User         = require('./user');

/**
 * Schema for an crime. 
 * @type {Schema}
 */
var crimeSchema = new Schema({
	// each item will have a unique numeric ID
	// _id     : Number,
	// User is referenced by their ObjectId.
	// Nested schemas aren't allowed in Mongoose, so
	// 'user: User' won't work
	user    : { type: Schema.Types.ObjectId, ref: 'User' },
	title   : String,
	body    : String,
	date	: { type: Date, default: Date.now },
	location: { lat: Number, lng: Number }
});

// add the elmongo plugin to our collection
crimeSchema.plugin(elmongo);

// initialize the model
var Crime = mongoose.model('Crime', crimeSchema);

// setup the search index
Crime.sync(function (err, numSynced) {
	// all crimes are now searchable in elasticsearch
	console.log('Number of items synced: ' + numSynced);
});

// create the model for an item and expose it to our app
module.exports = Crime;