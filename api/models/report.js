// ./api/models/report.js

var mongoose = require('mongoose'),
// elmongo = require('elmongo'),
Schema       = mongoose.Schema,
User         = require('./user');

/**
 * Schema for an report. 
 * @type {Schema}
 */
var reportSchema = new Schema({
	// each report will have a unique numeric ID
	// _id     : Number,
	// User is referenced by their ObjectId.
	// Nested schemas aren't allowed in Mongoose, so
	// 'user: User' won't work
	user    : { type: Schema.Types.ObjectId, ref: 'User' },
	name   : String,
	description    : String,
	place 			: String,
	date	: { type: Date, default: Date.now },
	latitude : Number,
	longitude : Number
});

// add the elmongo plugin to our collection
// reportSchema.plugin(elmongo);

// initialize the model
var Report = mongoose.model('Report', reportSchema);

// setup the search index
// Report.sync(function (err, numSynced) {
// 	// all crimes are now searchable in elasticsearch
// 	console.log('Number of reports synced: ' + numSynced);
// });

// create the model for an item and expose it to our app
module.exports = Report;