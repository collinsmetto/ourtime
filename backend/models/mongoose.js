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
            select: true // whether appears in queries
        }, 
        googleId: String,
        events: [],
        groups: [],
   
    });

    UserSchema.set('toJSON', {getters: true, virtuals: true});

    UserSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile,freeBusyList, cb) {
       console.log("in mongoose")
       //console.log(freeBusyList.calendars.primary.busy)
      
        var that = this;

        return this.findOne({
            'googleProvider.id': profile.id
        }, function(err, user) {

           
                    // no user was found, lets create a new one
                    if (!user) {
                   
                        var newUser = new that({
                            googleId: profile.id,
                            fullName: profile.displayName,
                            email: profile.emails[0].value,
                            events: freeBusyList.calendars.primary.busy,
                            groups: [],
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
                that.updateOne(
                    {googleId: profile.id},
                    {$set: {events:  freeBusyList.calendars.primary.busy,}},
                    {new: true, runValidators: true}).then(doc => {
                        console.log("Success updating user events")}).catch(err => {
                            console.error(err);
                        });  
            
                return cb(err, user);
            }
       
        });
    };

    mongoose.model('User', UserSchema);

    return db;
};
