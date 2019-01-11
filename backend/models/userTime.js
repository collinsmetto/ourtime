'use strict';

var mongoose = require('mongoose');
var gcal = require('google-calendar');
var Schema = mongoose.Schema;

module.exports = function () {

   var db = mongoose.connect('mongodb://ckmetto:tictactoe5@ds157853.mlab.com:57853/our_time');

    var userTimeSchema = new Schema({
		username: String,
		emails: [],
		googleId: String,
		thumbnail: String,
		events: [],
		groups: [],
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
        }
    });

    userTimeSchema.set('toJSON', {getters: true, virtuals: true});

    
    userTimeSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
        var that = this;
		var google_calendar = new gcal.GoogleCalendar(accessToken); // add
		console.log(google_calendar);

        return this.findOne({
            'googleProvider.id': profile.id
        }, function(err, user) {
            // no user was found, lets create a new one
            if (!user) {
                var newUser = new that({
					events: [], //eventsList.items,
                    groups: ["Group1"],
                    googleId: profile.id,
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
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
            } else {
				/** */
					// update freetime array 
					// get all calendars' events 
					google_calendar.events.list('primary', 
					{timeMin: (new Date()).toISOString(), singleEvents:true, orderBy:'startTime', maxResults: 3}, 
					function(err, eventsList){

						this.updateOne(
							{googleId: profile.id},
							{$set: {events: ["jdfksjdnfd"], }}, //eventsList.items,
							{new: true, runValidators: true}).then(doc => {
								console.log("Success updating user events")}).catch(err => {
									console.error(err);
								});  
					
						done(null, user);
						});
				/** */
                return cb(err, user);
            }
        });
    };

    mongoose.model('UserTime', userTimeSchema);

    return db;
};


/*
console.log(profile);
var google_calendar = new gcal.GoogleCalendar(accessToken);
// check if user already exists in our own db
User.findOne({googleId: profile.id}).then((currentUser) => {
	if(currentUser){
	
		//console.log(currentUser.emails[0].value); // email of logged in user 
		// already have this user, update events 
		// update freetime array 
	// get all calendars' events 
	google_calendar.events.list('primary', 
	{timeMin: (new Date()).toISOString(), singleEvents:true, orderBy:'startTime', maxResults: 3}, 
	function(err, eventsList){

		User.updateOne(
			{googleId: profile.id},
			{$set: {events:  eventsList.items,}},
			{new: true, runValidators: true}).then(doc => {
				console.log("Success updating user events")}).catch(err => {
					console.error(err);
				});  
	
		done(null, currentUser);
		});
	} else {
		

		// get all calendars' events 
		google_calendar.events.list('primary', 
		{timeMin: (new Date()).toISOString(), singleEvents:true, orderBy:'startTime', maxResults: 3}, 
		function(err, eventsList){
		
	  
		// if not, create user in our db
		new User({
			googleId: profile.id,
			emails: profile.emails,
			username: profile.displayName,
			thumbnail: profile._json.image.url,
			events: eventsList.items,
			groups: ["Group1"]
		}).save().then((newUser) => {
			//console.log('created new user: ', newUser);
			done(null, newUser);
		});
	});

	}
}); */