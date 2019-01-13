const router = require('express').Router();
var User = require('mongoose').model('User');
var jwt = require('jsonwebtoken'); 
var config = require('../config');
var gcal = require('google-calendar');



/******************************************************************************************/

router.get('/response', (req, res) => {
        console.log("in /profile/response");
        console.log(req.headers.authorization)

      var token = req.headers.authorization; 
      if (!token) {
          console.log("Token not received");
       return res.status(401).json({message: "Must pass token"});
      }
    // Check token that was passed by decoding token using secret
     jwt.verify(token, config.googleAuth.clientSecret, function(err, user) {

        if (err) throw err;
       //return user using the id from w/in JWTToken
        User.findOne({
            email:user.email

        }, function(err, user) {
         console.log(user);
           if (err) throw err;
              
            res.json({
                user: user, // return both user and token
                token: token,
       
            });
         });
      });
    
    
      
    });
 
/******************************************************************************************/


router.route('/myfreetime').get((req, res) => {
        console.log("in /profile/myfreetime NOW");
        console.log(req.headers.authorization)
    
      var token = req.headers.authorization; 
      if (!token) {
          console.log("Token not received");
       return res.status(401).json({message: "Must pass token"});
      }
    // Check token that was passed by decoding token using secret
     jwt.verify(token, config.googleAuth.clientSecret, function(err, user) {
        if (err) throw err;
      
       //return user using the id from w/in JWTToken
        User.findOne({
            email:user.email
        }, function(err, user) {
           console.log("hererererererererer");
           console.log(user.googleProvider.token)
            
            
            console.log("///////////////////////////////////// \n\n")
            var google_calendar = new gcal.GoogleCalendar(user.googleProvider.token);
            console.log(google_calendar.events)
            // events for this user 
            google_calendar.events.list('primary', 
            {timeMin: (new Date()).toISOString(), singleEvents:true, orderBy:'startTime'}, 
            function(err, eventsList){
                console.log("here\n\n")
                console.log(eventsList)
            });

           /*** */
          var  sampleEvents =  [
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
                    start: new Date(2019, 0, 13, 10, 30),
                    end: new Date(2019, 0, 13, 13, 15),
                    title: "A Suggested meeting time for Group OurTime" 
                  },
                ]
    


           /**** */


            // console.log("hererererer")
            // console.log(user.events);
           if (err) throw err;
            res.json({
                user: user, // return both user and token
                token: token,
                events: sampleEvents,//user.events,
                here: "pass from route freetime worked"
            });
         });
      });
    });


/******************************************************************************************/


router.route('/creategroup').get((req, res) => {
    console.log("in /creategroup NOW");
    console.log(JSON.stringify(req.headers.group))

 // var token = req.headers.authorization; 
  //console.log(token);

  


        // console.log("hererererer")
        // console.log(user.events);

        res.json({
            here: "pass from route freetime worked"
        });
     });




/******************************************************************************************/

// display my free time (logged in user's free time). 
router.get('/events/myfreetime', (req, res)=> {
// query database for this user's events. // QUESTION: why able to access database details of user via req.user
            User.findOne({googleId: req.user.googleId}).then((currentUser) => {
                if(currentUser){
                    // already have this user
                    res.send(currentUser.events);
                    done(null, currentUser);
                }
            });
});

/******************************************************************************************/
// display logged in users' groups and intersecting times. 
router.get('/events/mygroups', (req, res) => {
        User.findOne({googleId: req.user.googleId}).then((currentUser) => {
            if(currentUser){
                // already have this user
                var mygroups = [];
                for (var i of currentUser.groups) {
                    mygroups.push(i)
                }
                res.send(mygroups);
                done(null, currentUser);
            }
        });

    // query database for this user's group intersecting times.
     
    // display group name

    // display group intersecting times. 

});

/******************************************************************************************/

// display group members and intersecting times
router.get('/events/viewgroup', (req,res) => {
    Group.findOne({groupName: "Group1"}).then((group) => {
        if (group) {
            User.find({googleId: {$all: group.users}}).then((allUsers) => {
                var arrUsers = [{username: String, email: String}];

                allUsers.forEach(function(user, array){
                    arrUsers.push({username: user.username, email:user.emails})
                });

                res.send({members: arrUsers, freetimes: group.freetimes})
                done(null, allUsers);
            });    
            done(null, group);
        }
    });
});

/******************************************************************************************/

router.get('/events/viewallgroups', (req, res) => {
    User.findOne({googleId: req.user.googleId}).then((currentUser) => {
        if (currentUser) {
            var groupNames = [];
            // get group name
            currentUser.groups.forEach(function(group, array){
                groupNames.push(group);
            });

            // get all groups' free times 
            Group.find({groupName: {$all: groupNames}}).then((allGroups) => {
                var groupFreeTimes = [];
                allGroups.forEach(function(group, array){
                    groupFreeTimes.push(group.events);
                });
                res.send(groupFreeTimes);
                done(null, allGroups);
            })
        }
        done(null, currentUser)
    });
}); 

/******************************************************************************************/

router.get('/events/creategroup', (req,res) => {
    // receive a form with groupName, and email addresses of users. 
    var groupName = "Group1";
    var userEmails = ["collinsmetto@gmail.com", "ckmetto@princeton.edu"];
    
    /*****************************************************************/
    // check if group name already exists and throw error 
    Group.findOne({groupName: groupName}).then((currentGroup) => {
        if (currentGroup) { // TODO: if group already exists, opt to join group? 
            console.log("Group name exists") //  show modal
            done(null, currentGroup)
        }
        else {
                 // create a new group 
                new Group({
                    groupName: groupName,   
                }).save().then((newGroup) => {
                    done(null, newGroup);
                });
        }
    });

   /*****************************************************************/

    // LOOP: search for each user's email, add user to user array in GroupSchema, add user events to group   
  
    userEmails.forEach(function(userEmail, array){
                User.findOne({emails: {$elemMatch:{value:userEmail}}}).then((currentUser) => {
                
                    if(currentUser){

                        var googleId =  currentUser.googleId;
                        var result = addUserEvents(currentUser); // get user events 
                       
                        // push free time
                        Group.findOne({groupName: groupName}).then((group) => {
                            var eventsArr = group.events; 
                            eventsArr.push(result);

                            var freetimeArr =  sample.findGroupFreeTimes([eventsArr]); //["Success! These are the free times."];

                            // add users by googleId to this group &&  add user events to this group
                                Group.findOneAndUpdate(
                                    {groupName: groupName},
                                    {$addToSet: {users: googleId, events: result, freetimes: freetimeArr}}, // duplicate user solved by addToSet 
                                    {new:true, runValidators:true}).then(doc =>  {
                                        console.log("Success adding user events, and updating free times")}).catch(err => {
                                            console.error(err)});
                        });
    
                              
                        addGroupToUser(googleId,groupName); // add this group to user collection            
                       res.send({freetimes: freetimeArr})
                        done(null, currentUser);
                    
                    }
                    // user not found so add to error array. 
                    else {
                        console.log("User not found", userEmail);
                    }
                });
        });
        //res.send("Group created");
});



/******************************************************************************************/


router.get('/events/addmembertogroup', (req,res) => {
    
    var groupName = "Group1"
    var userEmails = ["collinsmetto@gmail.com"];
    userEmails.forEach(function(email, array){
        User.findOne({emails: {$elemMatch: {value:email}}}).then((currentUser) => {
            console.log("here")
            if(currentUser) {

                addGroupToUser(currentUser, groupName);
                addUserToGroup(currentUser, groupName);   
            }
            // create modal error page, send email invite 
            else {
                console.log("username", currentUser.username)
                console.log("User not found: addmembertogroup");
                // res.send("User not found: addmembertogroup");
            }
        });
        
    });
    res.send("Successfully added member to group");
});


/******************************************************************************************/

// remove self from group, admin remove a member from a group
router.get('/events/removememberfromgroup', (req,res) => {

    var groupName = "Group1";
    var userEmails = ["collinsmetto@gmail.com"];
    userEmails.forEach(function(email, array) {
        User.findOne({emails: {$elemMatch:{value: email}}}).then((currentUser) => {
            if  (currentUser) {
                removeGroupFromUser(currentUser, groupName);
                removeUserFromGroup(currentUser, groupName);
            }
            else {
                console.log("User not found");
            }
        });
    });


    res.send("Successfully removed member from group");
});

/******************************************************************************************/

// HELPER FUNCTIONS 
function addUserEvents(currentUser) {
       var events = []
        if(currentUser) {
            // save user events in array
            currentUser.events.forEach(element => {
               events.push(element);
            });
            var result = {googleId:String, events:[]};
            result = {googleId: currentUser.googleId, events: events}
            return result; 
        }
}

function addGroupToUser(user, groupName){
    console.log("here1")
    User.findOneAndUpdate(
        {googleId:user.googleId},
        {$addToSet:{groups:groupName}},
        {new: true, runValidators:true}).then(doc => {
            console.log("Success in adding group to user")}).catch(err => {
                console.error(err)})
}
 
function addUserToGroup(currentUser, groupName) {
    console.log("here2")
    // push free time
    Group.findOne({groupName: groupName}).then((group) => {
        var result = addUserEvents(currentUser); // get user events 
        var eventsArr = group.events; 
        
        eventsArr.push(result);

        // updated free time array 
        var freetimeArr = ["Success! These are the updated free times."]; //sample.findGroupFreeTimes([eventsArr]); 

        // add users by googleId to this group && add user events to this group
            Group.findOneAndUpdate(
                {groupName: groupName},
                {$addToSet: {users: currentUser.googleId, events: result}}, // duplicate user solved by addToSet 
                {new:true, runValidators:true}).then(doc =>  {
                    console.log("Success adding new member: to group")}).catch(err => {
                        console.error(err)});
            // update freetime array 
            Group.updateOne(
                {groupName: groupName},
                {$set: {freetimes: freetimeArr}},
                {new: true, runValidators: true}).then(doc => {
                    console.log("Success adding new member: updating freetime array ")}).catch(err => {
                        console.error(err);
                    });  
    });
}


function removeGroupFromUser(user, groupName) {
    User.updateOne(
        {googleId: user.googleId},
        {$pull: {groups: groupName}},
        {new: true, runValidators:true}).then(doc => {
            console.log("Success remove: group from user")}).catch(err => {
                console.error(err)});

}
function removeUserFromGroup(user, groupName){
    console.log("removeUserFromGroup");
  // remove users, events, update freetime
    Group.updateOne(
        {groupName: groupName},
        {$pull: {users: user.googleId, events:{googleId: user.googleId}}},
        {new: true, runValidators: true}).then(doc => {
            console.log("Success remove: user from group")}).catch(err => {
                console.error(err)});
  
    // update free times 
       Group.findOneAndUpdate({groupName: groupName}).then((group) => {
        var eventsArr = group.events; 
        eventsArr = eventsArray.filter(function(el) { return el.googleId != user.googleId; }); // exclude deleted user free events
        // compute new free times 
        var freetimeArr = ["Success! User remove: These are the free times after user has been removed."]; //sample.findGroupFreeTimes([eventsArr]); 
         console.log("HERERERERERE")
        // update freetime array 
        Group.updateOne(
            {groupName: groupName},
            {$set: {freetimes: ["SJBFDKSJBFDSKJFBSDKJ"]}},
            {new: true, runValidators: true}).then(doc => {
                console.log("Success remove: update user free time after remove from group ")}).catch(err => {
                    console.error(err);
                }); 
     });
}
function deleteGroup(groupName){}

/******************************************************************************************/    






module.exports = router;
