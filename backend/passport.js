'use strict';

require('./models/mongoose')();
require('./models/userTime')();
var passport = require('passport');
var User = require('mongoose').model('User');
var UserTime = require('mongoose').model('UserTime');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var config = require('./config');
var gcal = require('google-calendar');



// commented out module.exports
 module.exports = function () {
   

    passport.use(new GoogleTokenStrategy({
            clientID: config.googleAuth.clientID,
            clientSecret: config.googleAuth.clientSecret
        },
        function (accessToken, refreshToken, profile, done) {
            console.log("passport.js  fires functions ...")

 User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
                return done(err, user);
            });   
            // option 2 
            // UserTime.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
            //     return done(err, user);
            // });

 // end here           
})
);

 }

/*
            // User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
            //     return done(err, user);
            // });
            // option 2: save calendar events 
            UserTime.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
                return done(err, user);
            }); */

            /*
            var google_calendar = new gcal.GoogleCalendar(accessToken);

            // freebusy test
            var check = {
            timeMin: '2019-01-1T13:00:00-05:00',     
            timeMax:'2019-01-11T15:00:00-05:00',
            timeZone: 'America/New_York',
            items: [{id:'collinsmetto@gmail.com'}]
            }
        google_calendar.freebusy.query(check, function(err, response){
               if (err) console.log(err);
               else  console.log(response);
           });
        
*/      