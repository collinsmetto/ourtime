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

    UserSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
        var that = this;

        return this.findOne({
            'googleProvider.id': profile.id
        }, function(err, user) {

            

            var sampleEvents = [
                    {
                        start: new Date(2019, 0, 9, 12, 30),
                        end: new Date(2019, 0, 9, 2, 15),
                        title: "A Suggested meeting time for Group OurTime" 
                    },
            
                    {
                        start: new Date(2019, 0, 11, 10, 30),
                        end: new Date(2019, 0, 11, 13, 15),
                        title: "A Suggested meeting time for Group OurTime" 
                    },

                    {
                        start: new Date(2019, 0, 9, 1, 30),
                        end: new Date(2019, 0, 9, 3, 15),
                        title: "A Suggested meeting time for Group OurTime" 
                    }
                ]
           
                    // no user was found, lets create a new one
                    if (!user) {
                   
                        var newUser = new that({
                            googleId: profile.id,
                            fullName: profile.displayName,
                            email: profile.emails[0].value,
                            events: sampleEvents, //eventsList.items,
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
    };

    mongoose.model('User', UserSchema);

    return db;
};
