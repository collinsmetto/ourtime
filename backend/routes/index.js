var express = require('express');
var router = express.Router();
var { generateToken, sendToken } = require('../utils/token.utils');
var passport = require('passport');
var config = require('../config');
var request = require('request');
require('../passport')();// removed ();
var jwt = require('jsonwebtoken'); 
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

      if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }  
        console. log("in index routes")
        console.log(req.user)
        req.auth = {
            id: req.user.id, 
            email: req.user.email,
            googleId: req.user.googleId
        };
        
        next();
    }, generateToken, sendToken);






module.exports = router;