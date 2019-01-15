const router = require('express').Router();
var User = require('mongoose').model('User');
var jwt = require('jsonwebtoken'); 
var config = require('../config');
var gcal = require('google-calendar');
//var Group = require('../models/group');
require('../models/groupMongoose')();
var Group = require('mongoose').model('Group');
var timeFinder = require('../modules/timeFinder'); // import time finder module 

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

        }, function(err, user) {
         console.log(user);
         var allgroups = user.groups; //get details

           if (err) throw err;
        let groups = await Group.find({groupName: allgroups})
            res.json({
                user: user, // return both user and token
                token: token,
                groups: groups
       
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


router.get('/creategroup', async function (req, res) { //async
    console.log("in /creategroup NOW");
    // fetch input 
    var token = req.headers.authorization;
    
    var groupId = req.headers.groupid;
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
        Group.findOne({groupName: newGroupName}).then((group) => {
            if (group) { // TODO: if group already exists, opt to join group? 
                console.log("Group name exists") //  show modal
               // res.json{("Group name exists")}
                // done(null, group)
            }
            else 
            {
/********************************************************************************************************************************************/
                    // create a new group 
                   var group = new Group({
                        groupName: newGroupName,
                        groupId: groupId,
                        users: [], 
					    invalidUsers: [],
					    events: [],
					     freetimes:[],

                     })
                     group.save(function(error, savedGroup) {
                        if (error) {
                            console.log(error);
                        }
                        console.log(savedGroup);

                       // return cb(error, savedUser);
              
    

        // add logged in (self) to group 
        
        /*****/

         // Check token that was passed by decoding token using secret
         jwt.verify(token, config.googleAuth.clientSecret, function(err, user) {
            if (err) throw err;
            
             var userEmail = user.email;
             console.log(userEmail);  // id, email, googleId, iat, exp

            // add group to logged in user (self)
            User.findOneAndUpdate(
                {email: user.email},
                {$addToSet: {groups: newGroupName}},
                {new: true, runValidators:true}).then(doc => {
                    console.log("Success adding group to logged in user")}).catch(err => {
                        console.error(err)});
            // add logged in user (self) to group 
            var userEvents = getUserEvents(user);
             Group.findOneAndUpdate(
                {groupName: newGroupName},
                {$addToSet: {users: userEmail,  events: userEvents}},
                {new: true, runValidators:true}).then(doc => {
                    console.log("Success adding group to logged in user")}).catch(err => {
                        console.error(err)});
            
             
            })
        });


/********************************************************************************************************************************************/     
   
   // 2. add users and invalid users to groups.
   /*****************************************************************/

    // LOOP: search for each user's email, add user to user array in GroupSchema, add user events to group   
    groupEmails.forEach(function(userEmail) {
       console.log(userEmail)
       
        //var query = {email:'ckmetto@princeton.edu'};
       
        //var query = {email: userEmail};
        
        User.findOne({'email': userEmail}).then((user) => { // check this query!!!!!!
            console.log(user); // user is returned as null???? 
                        // push free time
                 Group.findOne({groupName: newGroupName}).then((group) => {
       
                if(user){
                console.log(user.email);
                    var googleId =  user.googleId;
                    console.log("sbksjbfksjbfksjdabfsdkjfbdskljfbsdlkajfbadsk")
                    var result = getUserEvents(user); // get user events  
                    var eventsArr = group.events; 
                    eventsArr.push(result);
                    // addGroupToUser(googleId, groupName); // NOT FUNCTIONAL: add this group to user collection

                    
                    // add users by googleId to this group &&  add user events to this group
                        Group.findOneAndUpdate(
                            {groupName: newGroupName},
                            {$addToSet: {users: userEmail, events: result}}, // duplicate user solved by addToSet 
                            {new:true, runValidators:true}).then(doc =>  {
                                console.log("Success adding user events, and updating free times")}).catch(err => {
                                    console.error(err)});

                        /**** */  // add group to user 
                                User.updateOne(
                                {googleId:user.googleId},
                                {$addToSet:{users: user.email, groups:newGroupName}},
                                {new: true, runValidators:true}).then(doc => {
                                    console.log("Success in adding group to user")
                                       }).catch(err => {
                                        console.error(err)})
                     }
                    // user not found so add to group error array. 
                    else {
                        console.log("User not found", userEmail);
                        Group.findOneAndUpdate(
                            {groupName: newGroupName},
                            {$addToSet: {invalidUsers: userEmail}},
                            {new: true, runValidators:true}).then(doc => {
                                console.log("Success adding invalid user emails")}).catch(err => {
                                    console.error(err)});
                                           
                    } 
                        });//
                //done(null, user);
               });//
     });// 
  
   /**************************************/
    
   // 3. build freetimes array and return freetimes and invalid users.
   /**************************************/
             // push free time
              Group.findOne({groupName: newGroupName}).then((group) => {
                var eventsArr = group.events; 
                eventsArr.push(result);

                var freetimeArr = ["these are the free times"];//  sample.findGroupFreeTimes([eventsArr]); //["Success! These are the free times."];
              
                // add free times to this group 
                    Group.findOneAndUpdate(
                        {groupName: newGroupName},
                        {$addToSet: {freetimes: freetimeArr}}, // duplicate user solved by addToSet 
                        {new:true, runValidators:true},
                        /*{groupfreetime: freetimeArr}).then(doc =>  {
                            console.log("Success updating free times")
                        */
                        ).catch(err => {
                                console.error(err)
                            });
                })
                
                         
 }});   // parent
// TODO: HOW TO SEND INFO BACK??
 // 4. return freetimes and invalid users.
let group = await Group.findOne({groupName:newGroupName});
// Group.findOne({groupName:newGroupName}), function (err, group) => {
//     if (err) { throw err; }
//     doSomethingElseWith(user);
//     res.json(result);
  
 res.json({
    freetimeArr: group,
    groupfreetime: "these are the group free times", // group.freeTimes
    errorUsers:"Error page: these users do not exist. Please invite them." // group.invalidUsers
});    
})                    



/******************************************************************************************/

router.get('/deletegroup', async (req, res) => {
    console.log("in /deletegroup NOW");
     var groupId = req.headers.groupid;
     var token = req.headers.authorization; 
    
       console.log(groupId);

        // get logged in user 
        if (!token) {
            console.log("Token not received");
        return res.status(401).json({message: "Must pass token"});
        }
        // Check token that was passed by decoding token using secret
        jwt.verify(token, config.googleAuth.clientSecret, async function(err, user) {
            if (err) throw err;
           //  console.log(user);  // id, email, googleId, iat, exp

            // 1. remove group from user 
           // User.findOneAndupdate({email: user.email}, { $pullAll: {groups: [groupId] } } )
               // remove user from group
              // push free time
             Group.findOne({groupId: groupId}).then((group) => {

                /* // free time algorithm here 
                var eventsArr = group.events; 
                console.log(eventsArr)
                var filteredEvents = group.events.filter(function(element) { return element.email != user.email; });
                console.log(filteredEvents);
                
                console.log(group.users);
                var newUsers = group.users.filter(function(element){ console.log(element); return element != user.email}) 
                console.log(newUsers)
                */
                // run free time algorithm 
                var freetimeArr = ["these are the free times"];//  sample.findGroupFreeTimes([eventsArr]); //["Success! These are the free times."];
                console.log(groupId);    
                     User.findOneAndUpdate(
                        {email: user.email},
                        {$pull: {groups: groupId}}, // duplicate user solved by addToSet 
                        {new:true, runValidators:true}).then(doc =>  {
                            console.log("Success updating free times")
                        }).catch(err => {
                                console.error(err)
                            });
                    
                    Group.findOneAndUpdate(
                        {groupId: groupId},
                        {$pull: {users: user.email, events:{email: user.email}}}, 
                        {new:true, runValidators:true}).then(doc =>  {
                            console.log("Success updating free times")
                        }).catch(err => {
                                console.error(err)
                            });

                    Group.findOneAndUpdate(
                        {groupId: groupId},
                        {$addToSet: {freetimes: freetimeArr}}, // duplicate user solved by addToSet 
                        {new:true, runValidators:true}).then(doc =>  {
                            console.log("Success updating free times")
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
                    console.log("User not found");
                }
            });
        });

    // add new members 
    newGroupMembers.forEach(function(newMemberEmail){
        User.findOne({email: newMemberEmail}).then((user) => {
                console.log(newMemberEmail);
                console.log(user);
            if(user) {
                addGroupToUser(user, groupId);
                addUserToGroup(user, groupId);   
            }

            else { // add to invalid users array of group 

                addInvalidUserToGroup(newMemberEmail, groupId);
                console.log("User not found: addmembertogroup");
              
            }
        });
        
    });
    
let group = await Group.findOne({groupId:groupId});
res.json({
        group:group,
            here: "return from route updategroup worked"
        });

});







/******************************************************************************************/



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
            console.log("Success adding invalid user emails")}).catch(err => {
                console.error(err)});
                       

}


function addGroupToUser(user, groupId){
    console.log("here1")
    console.log(user)
    User.findOneAndUpdate(
        {email:user.email},
        {$addToSet:{groups:groupId}},
        {new: true, runValidators:true}).then(doc => {
            console.log("Success in adding group to user")
            console.log(doc)
        }).catch(err => {
                console.error(err)})
}
 
function addUserToGroup(user, groupId) {
    console.log("here2")
    // push free time
    Group.findOne({groupId: groupId}).then((group) => {
        var result = getUserEvents(user); // get user events 
        var eventsArr = group.events; 
        
        eventsArr.push(result);

        // updated free time array 
        var freetimeArr = ["Success! These are the updated free times."]; //sample.findGroupFreeTimes([eventsArr]); 

        // add users by googleId to this group && add user events to this group
            Group.findOneAndUpdate(
                {groupId: groupId},
                {$addToSet: {users: user.email, events: result}}, 
                {new:true, runValidators:true}).then(doc =>  {
                    console.log("Success adding new member: to group")}).catch(err => {
                        console.error(err)});

            // update freetime array 
            Group.updateOne(
                {groupId: groupId},
                {$set: {freetimes: freetimeArr}},
                {new: true, runValidators: true}).then(doc => {
                    console.log("Success adding new member: updating freetime array ")}).catch(err => {
                        console.error(err);
                    });  
    });
}


function removeGroupFromUser(user, groupId) {
    User.updateOne(
        {email: user.email},
        {$pull: {groups: groupId}},
        {new: true, runValidators:true}).then(doc => {
            console.log("Success remove: group from user")}).catch(err => {
                console.error(err)});

}
function removeUserFromGroup(user, groupId){
    console.log("removeUserFromGroup");
  // remove users, events, update freetime
    Group.updateOne(
        {groupId: groupId},
        {$pull: {users: user.email, events:{email: user.email}}},
        {new: true, runValidators: true}).then(doc => {
            console.log("Success remove: user from group")}).catch(err => {
                console.error(err)});
  
    // update free times 
       Group.findOneAndUpdate({groupId: groupId}).then((group) => {
        var eventsArr = group.events; 
        eventsArr = eventsArray.filter(function(el) { return el.email!= user.email; }); // exclude deleted user free events
        // compute new free times 
        var freetimeArr = ["Success! User remove: These are the free times after user has been removed."]; //sample.findGroupFreeTimes([eventsArr]); 
         console.log("HERERERERERE")
        // update freetime array 
        Group.updateOne(
            {groupId: groupId},
            {$set: {freetimes: ["SJBFDKSJBFDSKJFBSDKJ"]}},
            {new: true, runValidators: true}).then(doc => {
                console.log("Success remove: update user free time after remove from group ")}).catch(err => {
                    console.error(err);
                }); 
     });
}


/******************************************************************************************/    






module.exports = router;
