/*
Program: group.js
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
   
var GroupSchema = new Schema
                    ({					
                       groupName: {type: String, unique: true,required: true,trim: true},
                       users: [], 
						events: [],
						freetimes:[],
                    });
  var Group = mongoose.model('Group', GroupSchema);
  module.exports = Group;