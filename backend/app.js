var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport'); // added passport
var config = require('./config') // added config 
const cookieSession = require('cookie-session'); // added cookie-session
var session = require('express-session');
var jwt = require('jsonwebtoken'); // added 
var index = require('./routes/index');
var profile = require('./routes/profileRoutes');
const mongoose = require('mongoose');

var app = express();

var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// initialize passport
app.use(passport.initialize());
app.use(passport.session());
/*** */
app.use('/api/v1/', index);
app.use('/profile', profile);
// Now we can access req.user so after we will call req.user, if we write it above these, it will always return underfined
app.use(function(req, res, next){
    res.locals.user = req.user || null
    console.log(req.user)
    next();
  })

 

module.exports = app;




