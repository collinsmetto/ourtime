var jwt = require('jsonwebtoken');
var config = require('../config')


var createToken = function(auth) {
    console.log("in token.utils")
    //console.log(auth)
    return jwt.sign({
            id: auth.id,
            email: auth.email,
            googleId: auth.googleId
        }, config.googleAuth.clientSecret, // added my-secret
        {
            expiresIn: 60 * 120
        });
};

module.exports = {
  generateToken: function(req, res, next) {
      req.token = createToken(req.auth);
      return next();
  },
  sendToken: function(req, res) {
      
      res.setHeader('x-auth-token', req.token);
      return res.status(200).send(JSON.stringify(req.user));
  }
};