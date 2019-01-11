var express = require('express');
var router = express.Router();
var { generateToken, sendToken } = require('../utils/token.utils');
var passport = require('passport');
var config = require('../config');
var request = require('request');
require('../passport')();
var jwt = require('jsonwebtoken');
//var mongoose = require('mongoose');
//var User = mongoose.model('../mongoose', 'User');
var User = require('mongoose').model('User');                    //.schema;

//var mongoose = require('mongoose');

//Load all your models
//var User = require('../mongoose.js');

//var User = require('mongoose').model('User');
//Now, this call won't fail because User has been added as a schema.
//mongoose.model('User');


//var express = require('express');
//var User = mongoose.model('mongoose.js', User);


//Middle ware that is specific to this router
/*router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  }); */
// router.get('/auth/response', (req, res) => {
    router.route('/auth/response')
    .post((req, res) => {
        console.log("in /auth/response");
          // return res.json({success: true, data: {"id": "123", "message": "sknfsknfa"}})
    console.log(req.body.params.resp)
    /*** */
      // check header or url parameters or post parameters for token
      var token = req.body.params.resp || req.body.token || req.query.token || req.headers['x-auth-token'] ||req.cookies.token;
      if (!token) {
          console.log("Token not received");
       return res.status(401).json({message: "Must pass token"});
      }
    // Check token that was passed by decoding token using secret
    jwt.verify(token, config.googleAuth.clientSecret, function(err, user) {
        if (err) throw err;
        console.log(user);
       //return user using the id from w/in JWTToken
        User.findById({
        "_id": user._id
        }, function(err, user) {
           if (err) throw err;
              user = utils.getCleanUser(user); 
             //Note: you can renew token by creating new token(i.e.    
             //refresh it)w/ new expiration time at this point, but I’m 
             //passing the old token back.
             // var token = utils.generateToken(user);
            res.json({
                user: user, // return both user and token
                token: token
            });
         });
      });
    });


router.route('/auth/google')
    .post(passport.authenticate('google-token', {session: false}), function(req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
        console.log("/auth/google FIRED!!!!")
        req.auth = {
            id: req.user.id
        };

        next();
    }, generateToken, sendToken);

module.exports = router;