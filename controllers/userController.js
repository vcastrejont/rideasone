var userModel = require('../models/userModel.js');
var mongoose = require('mongoose');
/**
 * eventController.js
 *
 * @description :: Server-side logic for managing events.
 */
module.exports = {
    /**
     * eventController.list()
     */
    list: function(req, res) {
        userModel.find(function(err, users){
            if(err) {
              return res.json(500, {message: 'Error getting users'});
            }
              return res.json(200, users);
        });
    },
    create: function(req, res) {
      var profile = req.body.profile;

      if(profile) {
        userModel.findOne({
          provider_id: profile.id
        }, function(err, user) {

    			if(err) {
            throw(err);
          }

    			if(!err && user != null) {
            return res.json(200, user);
          }

    			var user = new userModel({
    				provider_id	: profile.id,
    				provider		: profile.provider,
    				name			  : profile.displayName,
    				photo				: profile.photos[0].value,
            email       : profile.emails[0].value
    			});

    			user.save(function(err) {
    				if(err) {
              throw err;
            }

    				return res.status(200).json(user);
    			});
    		});
      }

    }
};
