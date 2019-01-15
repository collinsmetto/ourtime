const router = require('express').Router();
var User = require('mongoose').model('User');
var jwt = require('jsonwebtoken'); 
var config = require('../config');
var gcal = require('google-calendar');
require('../models/groupMongoose')();
var Group = require('mongoose').model('Group');
var timeFinder = require('../modules/timeFinder'); // import time finder module 
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
/******************************************************************************************/


router.get('/getallgroups', async (req, res) => {
       

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

      }, async function(err, user) {
       console.log(user);
       var allgroups = user.groups; //get details

         if (err) throw err;
      let groups = await Group.find({groupName: allgroups})
      console.log(groups);
          res.json({
          
              groups: groups
     
          });
       });
    });
  
  
    
  });

/******************************************************************************************/

router.get('/creategroup', async function (req, res) { //async
    // console.log("in /creategroup NOW");
    // fetch input 
    var token = req.headers.authorization;
    var newGroupId = req.headers.groupid;
    var newGroupName = req.headers.groupname;
    var groupEmails = req.headers.groupemails.split(',');
    
      // 1. create group. 
   /**************************************/
 
 /*
   Group.upsertGroup(newGroupName, groupId, function(err, group) {
    console.log("in upsert");
    console.log(err)
    //return done(err, group); // exits with code 0
});
*/



        // check if group name already exists and throw error 
        Group.findOne({groupId: newGroupId}).then((group) => {
            if (group) { // TODO: if group already exists, opt to join group? At the moment, groups can have same name
               // console.log("Group name exists") //  show modal
               // res.json{("Group name exists")}
                // done(null, group)
            }
            else 
            {
/********************************************************************************************************************************************/
                    // create a new group 
                   var group = new Group ({
                        groupName: newGroupName,
                        groupId: newGroupId,
                        users: [], 
					    invalidUsers: [],
					    events: [],
					    freetimes:[],
                     })
                     group.save(function(error, savedGroup) {
                        if (error) {
                            console.log(error);
                        }
                       // console.log(savedGroup);
                    
        // add logged in (self) to group 
        
        /*****/

         // Check token that was passed by decoding token using secret
         jwt.verify(token, config.googleAuth.clientSecret, function(err, user) {
            if (err) throw err;
            
             var userEmail = user.email;
            
            // add group to logged in user (self)
            User.findOneAndUpdate(
                {email: user.email},
                {$addToSet: {groups: newGroupId}},
                {new: true, runValidators:true}).then(doc => {
                    //console.log("Success adding group to logged in user")
                }).catch(err => {
                        console.error(err)});
            // add logged in user (self) to group 
            var userEvents = getUserEvents(user);
             Group.findOneAndUpdate(
                {groupId: newGroupId},
                {$addToSet: {users: userEmail,  events: userEvents}},
                {new: true, runValidators:true}).then(doc => {
                    // console.log("Success adding group to logged in user")
                }).catch(err => {
                        console.error(err)});
            
            })
       


/********************************************************************************************************************************************/     
   
   // 2. add users and invalid users to groups.
   /*****************************************************************/

    // LOOP: search for each user's email, add user to user array in GroupSchema, add user events to group   
    groupEmails.forEach(function(userEmail) {
      
        
        User.findOne({'email': userEmail}).then((user) => { 
            
                 Group.findOne({groupId: newGroupId}).then((group) => {
       
                if(user){
               
                    var googleId =  user.googleId;
               
                    var result = getUserEvents(user); // get user events  
                    // var eventsArr = group.events; 
                    // eventsArr.push(result);
                    // addGroupToUser(googleId, groupId); // NOT FUNCTIONAL: add this group to user collection

                    
                    // add users by groupId to this group &&  add user events to this group
                        Group.findOneAndUpdate(
                            {groupId: newGroupId},
                            {$addToSet: {users: userEmail, events: result}}, 
                            {new:true, runValidators:true}).then(doc =>  {
                                // console.log("Success adding user events, and updating free times")
                            }).catch(err => {
                                    console.error(err)});

                       // add group to user 
                        User.updateOne(
                        {googleId:user.googleId},
                        {$addToSet:{users: user.email, groups:newGroupId}},
                        {new: true, runValidators:true}).then(doc => {
                            // console.log("Success in adding group to user")
                                }).catch(err => {
                                console.error(err)})
                     }
                    // user not found so add to group error array. 
                    else {
                        
                        Group.findOneAndUpdate(
                            {groupId: newGroupId},
                            {$addToSet: {invalidUsers: userEmail}},
                            {new: true, runValidators:true}).then(doc => {
                             //   console.log("Success adding invalid user emails")
                            }).catch(err => {
                                    console.error(err)});
                                           
                    } 
                });
            });
     });
  
   /**************************************/
  
   // 3. build freetimes array and return freetimes and invalid users.
   /**************************************/
             // push free time
          Group.findOne({groupId: newGroupId}).then((group) => {
               
                var groupEvents = group.events; 
                var freeDates = getFreeTimes(groupEvents);
                
                 

                // add free times to this group 
                    Group.findOneAndUpdate(
                        {groupId: newGroupId},
                        {$addToSet: {freetimes: freeDates}}, 
                        {new:true, runValidators:true}).catch(err => {
                                console.error(err);
                            });
                })
                
            }); // "save"                     
 }});   // parent

            // 4. return freetimes and invalid users.
            let group = await Group.findOne({groupId:newGroupId});

            
            res.json({
                group: group,
                message: "group from create group"
            
            });    
})   

function getFreeTimes (groupEvents) 
    {
    // synthesize group events. 
    var AllGroupEvents = combineGroupEvents(groupEvents)
    var events = sanitizeEvents(AllGroupEvents);
   // Define range of times within which to meet 
    var timeNow = new Date();
    var timeMonthFromNow = new Date();
    timeMonthFromNow.setMonth(timeMonthFromNow.getMonth() + 1);
 
    var interval = moment.range(timeNow, timeMonthFromNow);

    var freetimeArr = timeFinder.subtractRanges(interval, events);// compute free time 
     var freeDates = convertMomentToDate(freetimeArr);
    
     return freeDates;



     // in-body code 
           /*         
                // synthesize group events. 
                var AllGroupEvents = combineGroupEvents(groupEvents)
                var events = sanitizeEvents(AllGroupEvents);
               // Define range of times within which to meet 
                var timeNow = new Date();
                var timeMonthFromNow = new Date();
                timeMonthFromNow.setMonth(timeMonthFromNow.getMonth() + 1);
             
                var interval = moment.range(timeNow, timeMonthFromNow);
            
                var freetimeArr = timeFinder.subtractRanges(interval, events);// compute free time 
                 var freeDates = convertMomentToDate(freetimeArr);
                */
    }

function combineGroupEvents(groupEvents) {
   
var groupEvents = group.events;
var eventsArr = [];
    for (i=0; i<groupEvents.length; i++) { 
       // console.log(groupEvents[i].events)
        var childArray = groupEvents[i].events;

        for(j = 0; j < childArray.length;j++) { 
            if (childArray[j])
                eventsArr.push(childArray[j]);
        }
    }
    var AllGroupEvents = {allUserEvents:eventsArr}
        return AllGroupEvents;
 }

function sanitizeEvents(user) {
    events = []
    e = null;
    for (i=0; i<user.allUserEvents.length; i++) {
        e = moment.range(user.allUserEvents[i].start, user.allUserEvents[i].end); 
        events.push(e);
    }
    return events;
}
 
function convertMomentToDate(freetimeArr) {
     var freetime = [];

     for (i = 0; i < freetimeArr.length; i++) {
       
        var string = freetimeArr[i].toString();
        var event = string.split('/');
        var obj = {start: event[0], end: event[1]}
        freetime.push(obj);
     }
     return freetime;

}

/******************************************************************************************/

router.get('/deletegroup', async (req, res) => {
   
     var groupId = req.headers.groupid;
     var token = req.headers.authorization; 
    
        // get logged in user 
        if (!token) {
           // console.log("Token not received");
        return res.status(401).json({message: "Must pass token"});
        }
        // Check token that was passed by decoding token using secret
        jwt.verify(token, config.googleAuth.clientSecret, async function(err, user) {
            if (err) throw err;
            // 1. remove group from user 
               // remove user from group
              // push free time
             Group.findOne({groupId: groupId}).then((group) => {

                // synthesize group events. 
                var groupEvents = group.events; 
                var freeDates = getFreeTimes(groupEvents);
                

                User.findOneAndUpdate(
                        {email: user.email},
                        {$pull: {groups: groupId}}, // duplicate user solved by addToSet 
                        {new:true, runValidators:true}).then(doc =>  {
                            // console.log("Success updating free times")
                        }).catch(err => {
                                console.error(err)
                            });
                    
                    Group.findOneAndUpdate(
                        {groupId: groupId},
                        {$pull: {users: user.email, events:{email: user.email}}}, 
                        {new:true, runValidators:true}).then(doc =>  {
                           // console.log("Success updating free times")
                        }).catch(err => {
                                console.error(err)
                            });

                    Group.findOneAndUpdate(
                        {groupId: groupId},
                        {$addToSet: {freetimes: freeDates}}, // duplicate user solved by addToSet 
                        {new:true, runValidators:true}).then(doc =>  {
                            //console.log("Success updating free times")
                        }).catch(err => {
                                console.error(err)
                            });
                    



                        });           

        });
      let group = await Group.findOne({groupId: groupId});
      res.json({
        group:group,
        here: "return from route deletegroup worked"
    });


    });

/******************************************************************************************/

router.get('/updategroup', async (req, res) => {
        // fetch input 
        var token = req.headers.authorization;
        var groupId = req.headers.groupid; // groupid 
        var oldGroupMembers = req.headers.oldgroupmembers.split(',');;
        var newGroupMembers = req.headers.newgroupmembers.split(',');;
// error check for invalid users.  // create modal error page, send email invite 
       
        // Remove old members 
    oldGroupMembers.forEach(function(oldMemberEmail, array) {
            User.findOne({email: oldMemberEmail}).then((user) => {
                if  (user) {
                    removeGroupFromUser(user, groupId);
                    removeUserFromGroup(user, groupId);
                }
                else { // add to invalid users 
                    addInvalidUserToGroup(oldMemberEmail, groupId);
                   // console.log("User not found");
                }
            });
        });

    // add new members 
    newGroupMembers.forEach(function(newMemberEmail){
        User.findOne({email: newMemberEmail}).then((user) => {
            if(user) {
                addGroupToUser(user, groupId);
                addUserToGroup(user, groupId);   
            }

            else { // add to invalid users array of group 

                addInvalidUserToGroup(newMemberEmail, groupId);
              
            }
        });
        
    });
    
let group = await Group.findOne({groupId:groupId});
res.json({
        group :group,
            message: "group from update group"
        });

});





/******************************************************************************************/


/******************************************************************************************/

// HELPER FUNCTIONS 
function getUserEvents(user) {
       var events = []
        if(user) {
            // save user events in array
        if (user.events) {
            user.events.forEach(element => {
               events.push(element);
            });
        }
            var result = {email:String, events:[]};
            result = {email: user.email, events: events}
            return result; 
        }
}

function addInvalidUserToGroup (userEmail, groupId) {
    Group.findOneAndUpdate(
        {groupId: groupId},
        {$addToSet: {invalidUsers: userEmail}},
        {new: true, runValidators:true}).then(doc => {
           // console.log("Success adding invalid user emails")
        }).catch(err => {
                console.error(err)});
                       

}


function addGroupToUser(user, groupId){
    
    User.findOneAndUpdate(
        {email:user.email},
        {$addToSet:{groups:groupId}},
        {new: true, runValidators:true}).then(doc => {
           // console.log("Success in adding group to user")
           // console.log(doc)
        }).catch(err => {
                console.error(err)})
}
 
function addUserToGroup(user, groupId) {
   
    // push free time
    Group.findOne({groupId: groupId}).then((group) => {
        var result = getUserEvents(user); // get user events 
        var eventsArr = group.events; 
        eventsArr.push(result); // {email: String, events: []}

     
        
        // synthesize group events. 
        var groupEvents = eventsArr; // updated events array 
        var freeDates = getFreeTimes(groupEvents);
        
        

        // add users by googleId to this group && add user events to this group
            Group.findOneAndUpdate(
                {groupId: groupId},
                {$addToSet: {users: user.email, events: result}}, 
                {new:true, runValidators:true}).then(doc =>  {
                    //console.log("Success adding new member: to group")
                }).catch(err => {
                        console.error(err)});

            // update freetime array 
            Group.updateOne(
                {groupId: groupId},
                {$set: {freetimes: freeDates}},
                {new: true, runValidators: true}).then(doc => {
                    // console.log("Success adding new member: updating freetime array ")
                }).catch(err => {
                        console.error(err);
                    });  
    });
}


function removeGroupFromUser(user, groupId) {
    User.updateOne(
        {email: user.email},
        {$pull: {groups: groupId}},
        {new: true, runValidators:true}).then(doc => {
           // console.log("Success remove: group from user")
        }).catch(err => {
                console.error(err)});

}
function removeUserFromGroup(user, groupId){
   
  // remove users, events, update freetime
    Group.updateOne(
        {groupId: groupId},
        {$pull: {users: user.email, events:{email: user.email}}},
        {new: true, runValidators: true}).then(doc => {
            // console.log("Success remove: user from group")
        }).catch(err => {
                console.error(err)});
  
    // update free times 
       Group.findOneAndUpdate({groupId: groupId}).then((group) => {
            var eventsArr = group.events; 
            eventsArr = eventsArray.filter(function(el) { return el.email!= user.email; }); // exclude deleted user free events
            
      
              // synthesize group events. 
        var groupEvents = eventsArr; // updated events array 
        var freeDates = getFreeTimes(groupEvents);
        
        

        // update freetime array 
        Group.updateOne(
            {groupId: groupId},
            {$set: {freetimes: freeDates}},
            {new: true, runValidators: true}).then(doc => {
               // console.log("Success remove: update user free time after remove from group ")
            }).catch(err => {
                    console.error(err);
                }); 
     });
}


/******************************************************************************************/    


module.exports = router;
