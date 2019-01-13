/*
Program: group.js
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;




var EventSchema = new Schema ({
	start: {
		date: Date, // changed this from String 
		dateTime: Date  // changed this from String 
		
	},
	end: {
		date: Date,
		dateTime: Date,
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