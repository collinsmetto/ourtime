/*
Program: event.js
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var EventSchema = new Schema ({
	start: {
		date: String, // changed this from String 
		dateTime: String,  // changed this from String 
		timeZone: String
	},
	end: {
		date: String,
		dateTime: String,
		timeZone: String
	},
	});
	
	  

//Export model
module.exports = mongoose.model('Event', EventSchema);