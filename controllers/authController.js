var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

module.exports = {
  PostGoogleAuth: function (req, res, next) {
    passport.authenticate('google-id-token', function (err, user, info) {
      if (err) return res.status(401).json({ message: err.message });
      if (!user) return res.status(401).json(info);
      var token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: '36500 days', // 100 years
        issuer: config.issuer
      });
      return res.json({ token: token });
    })(req, res, next);
  },

  GetProfile: function (req, res) {
    res.json(req.user.profile);
  },

  FakeAuthForTesting: function (req, res, next) {
  console.log(req.body);
    var token = jwt.sign({id: req.body.userId}, config.jwtSecret, {
      expiresIn: '36500 days', // 100 years
      issuer: config.issuer
    });
    return res.json({ token: token });
  }
  
};

