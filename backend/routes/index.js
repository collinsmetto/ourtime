var express = require('express');
var router = express.Router();
var { generateToken, sendToken } = require('../utils/token.utils');
var passport = require('passport');
var config = require('../config');
var request = require('request');
require('../passport')();// removed ();
var jwt = require('jsonwebtoken'); // added 
var User = require('mongoose').model('User');
var nodemailer = require('nodemailer');
const creds = require('../config/config');


var transport = {
    host: 'smtp.gmail.com',
    auth: {
      user: creds.USER,
      pass: creds.PASS
    }
  }
  
  var transporter = nodemailer.createTransport(transport)
  
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take messages');
    }
  });

// control the body of the message here. 
router.post('/send', (req, res, next) => {
    var name = req.body.name
    var email = req.body.email
    var message = req.body.message
    var content = `name: ${name} \n email: ${email} \n message: ${message} `
  
    var mail = {
      from: name,
      to: email,  //Change to email address that you want to receive messages on
      subject: 'New Message from Contact Form',
      text: message
    }
  
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.json({
          msg: 'fail'
        })
      } else {
        res.json({
          msg: 'success'
        })
      }
    })
  })



router.route('/auth/google')
    .post(passport.authenticate('google-token', {session: false}), function(req, res, next) { 
      //console.log(req.user)  
      if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
       
        
        req.auth = {
            id: req.user.id, 
            email: req.user.email
        };
        
        next();
    }, generateToken, sendToken);






// router.get('/auth/response', (req, res) => {
router.route('/auth/response')
.post((req, res) => {
    console.log("in /auth/response");
    console.log(req)
   // console.log(req.body.params.resp)
   
      // return res.json({success: true, data: {"id": "123", "message": "sknfsknfa"}})
// THE token
//console.log(req.body.params.resp)
/*** */
console.log("not respomdeinfdk")
  
/*
// check header or url parameters or post parameters for token
  var token = "nsdksl"; //req.body.params.resp|| req.body.token || req.query.token || req.headers['x-auth-token'] ||req.cookies.token;
  if (!token) {
      console.log("Token not received");
   return res.status(401).json({message: "Must pass token"});
  }
// Check token that was passed by decoding token using secret
 jwt.verify(token, config.googleAuth.clientSecret, function(err, user) {
   //console.log(user.email)
   //console.log(user.id)
    if (err) throw err;
   //return user using the id from w/in JWTToken
    User.findOne({
    email:user.email
    //log(" REACHED THIS POINT IN CODE 97");
    }, function(err, user) {
      console.log("reached error part of function")
      //console.log(user)
       if (err) throw err;
          //console.log("Reached 104")
          //user = utils.getCleanUser(user); 
          console.log("Reached 106")

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

*/

  
});
/**** */




module.exports = router;