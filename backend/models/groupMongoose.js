'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = function () {

   var db = mongoose.connect('mongodb://ckmetto:tictactoe5@ds157853.mlab.com:57853/our_time');

     
        var GroupSchema = new Schema ({					
                groupName: {type: String, required: true,trim: true},
                groupId: {type: Number, unique: true, required: true, trim: true},
                users: [], 
                invalidUsers: [],
                events: [],
                freetimes:[],
        });

    GroupSchema.set('toJSON', {getters: true, virtuals: true});

    GroupSchema.statics.upsertGroup = function(groupName, groupId, cb) {
       console.log("in groupMongoose")
      
        var that = this;

        return this.findOne({
            'groupName': groupName
        }, async function(err, group) {
            console.log("here");
            console.log(group);
                    // no group was found, lets create a new one
                    if (!group) {
                            // create a new group 
                            var newGroup = new that({
                            groupName: groupName,
                            groupId: groupId,
                            users: [], 
                            invalidUsers: [],
                            events: [],
                            freetimes:[],

                        })

                        try {
                            let GROUP =  await newGroup.save(); 
                          return cb(GROUP);
                          
                      }
                      catch (err){console.log(err)}
                //  newGroup.save(function(error, savedGroup) {
                //     if (error) {
                //         console.log(error);
                //     }
                //    return cb(error, savedGroup);
                // });


            } else { 
                return cb(err, group);
            }
       
        });
    };

    mongoose.model('Group', GroupSchema);

    return db;
};
/*
try {
        let GROUP =  await newGroup.save(function(error, savedGroup) {
            if (error) {
                console.log(error);
            }
        return cb(error, savedGroup);
        });
    }
    catch (err){console.log(err)}df


*/
/*
    try{
        let newGroup = await group.save();
    } catch (err){
        if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).send(new MyError('Duplicate key', [err.message]));
        }
    
        res.status(500).send(err);
    }
}
});

*/