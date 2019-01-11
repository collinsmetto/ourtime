'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var gcal = require('google-calendar');

module.exports = function () {

   var db = mongoose.connect('mongodb://ckmetto:tictactoe5@ds157853.mlab.com:57853/our_time');

    var UserSchema = new Schema({
        email: {
            type: String, required: true,
            trim: true, unique: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        },
        
        googleProvider: {
            type: {
                id: String,
                token: String
            },
            select: false
        }, 
        googleId: String,
        events: [],
        groups: [],
   
    });

    UserSchema.set('toJSON', {getters: true, virtuals: true});

    UserSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
        var that = this;

        return this.findOne({
            'googleProvider.id': profile.id
        }, function(err, user) {
            var google_calendar = new gcal.GoogleCalendar(accessToken);
           
            google_calendar.events.list({calendarId:'primary', 
            timeMin: (new Date()).toISOString(), singleEvents:true, orderBy:'startTime'}, 
            function(err, eventsList) {
                    // no user was found, lets create a new one
                    if (!user) {
                        var newUser = new that({
                            googleId: profile.id,
                            fullName: profile.displayName,
                            email: profile.emails[0].value,
                            events: eventsList.items,
                            googleProvider: {
                                id: profile.id,
                                token: accessToken
                            }
                        });

                        newUser.save(function(error, savedUser) {
                            if (error) {
                                console.log(error);
                            }
                            return cb(error, savedUser);
                        });
               

            } else { // update calendar events
                return cb(err, user);
            }
        });
        });
    };

    mongoose.model('User', UserSchema);

    return db;
};
