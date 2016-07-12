var User = require('../models/user.js');
var config = {
  twitter: {
    key: 'jq5f1KwBuSUimnn78MskHlL5i',
    secret: 'aL1qpqo4g3oownskIzwz3XoWHQl4FMlvHeqop6bfX2oIYvv6pp'
  },
  facebook: {
    key: '1515943715378851',
    secret: 'e4fa56b2a2be6dbfa96994baf9660643'
  },
  google: {
    key: '764821343773-cjpf8lnubnnmjrupiu8oen4vsacgcq9n.apps.googleusercontent.com',
    secret: '5sAsJshpCHf_s4Tzk17_7nTK'
  }
};

var GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new GoogleStrategy({
    clientID: config.google.key,
    clientSecret: config.google.secret,
    callbackURL: '/auth/google/callback',
    profileFields: ['id', 'emails', 'birthday']
  }, function (accessToken, refreshToken, profile, done) {
    User.findOne({provider_id: profile.id}, function (err, user) {
      if (err) throw (err);
      if (!err && user != null) return done(null, user);
      var user = new User({
        provider_id: profile.id,
        provider: profile.provider,
        name: profile.displayName,
        photo: profile.photos[0].value,
        email: profile.emails[0].value
      });
      user.save(function (err) {
        if (err) throw err;
        done(null, user);
      });
    });
  }));
};
