'use strict';

require('./models/mongoose')();
//require('./models/userTime')();
var passport = require('passport');
var User = require('mongoose').model('User');
//var UserTime = require('mongoose').model('UserTime');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var config = require('./config');
var gcal = require('google-calendar');

 module.exports = function () {
   

    passport.use(new GoogleTokenStrategy({
            clientID: config.googleAuth.clientID,
            clientSecret: config.googleAuth.clientSecret
        },
        function (accessToken, refreshToken, profile, done) {
          //  console.log("passport.js  fires functions ...")

            var google_calendar = new gcal.GoogleCalendar(accessToken);
            // freeBusy events for this user 
                var timeNow = new Date();
                var timeMonthFromNow = new Date();
                timeMonthFromNow.setMonth(timeMonthFromNow.getMonth() + 1);

                var check = {
                            timeMin: timeNow,     
                            timeMax:timeMonthFromNow ,
                            timeZone: 'America/New_York',
                            items: [{id:'primary'}]
                         }
            google_calendar.freebusy.query(check, function(err, freeBusyList){
                    if (err) console.log(err);
                    else {
                       // console.log(freeBusyList.calendars.primary.busy)
                        User.upsertGoogleUser(accessToken, refreshToken, profile, freeBusyList, function(err, user) {
                            return done(err, user);
                        });
                    }
                });
        })
    );
}

 /*
            // Option 1 
            // User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
            //     return done(err, user);
            // });
            // option 2: save calendar events 
            UserTime.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
                return done(err, user);
            }); */

           