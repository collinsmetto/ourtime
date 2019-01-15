#! /usr/bin/env node

console.log('This script does operations with data from the database.');

// Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');
// mongodb://OurTime:tictactoe5@ds157853.mlab.com:57853/our_time
// Get arguments passed on command line
var userArgs = process.argv.slice(2);
// if (!userArgs[0].startsWith('mongodb://')) {
//     console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
//     return
// }

var async = require('async')

var User = require('../models/userTime')
var Event = require('../models/event')
//var chance = require('chance').Chance(); // to generate random entries 
/*
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true); // set mongoose to avoid collection.ensureIndex Deprecation warning 


var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser : true});
mongoose.Promise = global.Promise;

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

*/

//User.find({}, function(err, allUsers){
function findGroupFreeTimes(allUsers) {
    var userArrays = [];
    //-----------------------------------------------------------------------------------
    for (var x of allUsers) {
      
        //ASSUMING these are events for ONE DAY 
        var events = x.events;
       
            var eventsInADay = new Date(events[0].start.date); 
            var templateDate = new Date(eventsInADay.getFullYear() + "," + 
                                        (eventsInADay.getMonth() + 1) +
                                        "," + eventsInADay.getDate());
           
            templateDate = templateDate.getTime(); // convert to datetime 
        //------------------------------
        // initialize this user's array with 0's, and datetimes from 00:00:00 - 23:59:00
        var arrUser = [];
        var MILLISECONDS_PER_MINUTE = 60000;
        var MAX_VALUE = 1440;  
        for (var i = 0; i < MAX_VALUE; i++) {
            arrUser.push({time: templateDate, count: 0});
            templateDate += MILLISECONDS_PER_MINUTE;
        }

        //------------------------------

        // for each event, flag respective element appropriately
        for (var event of events) {
            console.log("\n SCHEDULED TIME")
            console.log(event)
            var start = new Date(event.start.date).getHours() * 60 + // *60 convert hours to minutes 
                        new Date(event.start.date).getMinutes(); 

            var end = new Date(event.end.date).getHours() * 60 + // *60 convert hours to minutes 
                      new Date(event.end.date).getMinutes(); 
             // mark scheduled chunks of time 
            for (var i = start; i < end; i++) {
                 arrUser[i] = {time:arrUser[i].time, count: arrUser[i].count + 1};
              
            }
        }
        // userArrays saves each user and their array: each element in arr is {time:time, count:count} 
        userArrays.push({user: x.user, array: arrUser}) // save each user's array with user label 
        // TODO: Save unscheduled time per user to db 
        break;
    }
    //-----------------------------------------------------------------------------------
    // do some operations with user array. 
    var arrResult = findSum(userArrays); // result array 
  
    var arrIntersection = findIntersection(arrResult);

   // convet timestamps for readability 
   arrConvertedTime = convertToDate(arrIntersection);
   console.log("\n\n UNSCHEDULED TIME");
   console.log(arrConvertedTime)

};
function convertToDate(arrIntersection) {
    var arrConvertedTime = [];

    for (var element of arrIntersection) {
       arrConvertedTime.push({start: new Date(element.start) +"", end : new Date(element.end) + ""});
    }
    return arrConvertedTime;
}
// find intersections in user arrays
function findSum(userArrays) {

    var arrResult = []; // array to put sums in 
    var MAX_VALUE = 1440;
    // initialize 
    for (var i = 0; i < MAX_VALUE; i++) {
        arrResult.push(0);
    }
    for (var temp of userArrays) {
        var arr = temp.array;  // each element in arr is {time:time, count:count}
       
        for (var i = 0; i < MAX_VALUE; i++) {
            arrResult[i] = {time:arr[i].time, count:arr[i].count + arrResult[i]};
           //console.log(arr[i].count);
        }
    }
    // arrUser[i] = {time:arrUser[i].time, count: arrUser[i].count + 1};

    return arrResult;

}

/*
var arrResult = [0,0,1,1]
console.log(arrResult); 
var arrIntersection = findIntersection(arrResult);
console.log(arrIntersection)
*/
function  findIntersection(arrResult) {
 var zeroFlag = false; // zeroFlag to indicate whether encountered zero before
 var nonZeroFlag = false; //nonZeroFlag to indicate whether encountered zero before
    var start = 0;
    var end =0; 
    var arrIntersection = [];
    var arrLength = arrResult.length;

 for (var i = 0; i < arrLength; i++) {
     // found zero
     var element = arrResult[i].count;
     
     if (element == 0) {
       if (zeroFlag) { // if within a contiguous block of zeros 
           end = i;
       } else {     // first zero to encounter          
           start = i;
           end = i;
           zeroFlag = true;
           nonZeroFlag = false;      
       }
    }
    // found non-zero number 
    else if (i != 0) { 
        if (nonZeroFlag) continue;
        if (start != end) // case where minute 0 ie 12:00:00 is scheduled: start = end = 0 (initialization states)
            arrIntersection.push({start: arrResult[start].time, end: arrResult[end].time}); // first time seeing a non-zero element
        zeroFlag = false;
        nonZeroFlag = true; 
    }
 }
 return arrIntersection;
}





