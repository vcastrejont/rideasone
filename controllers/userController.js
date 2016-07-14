var userModel = require('../models/user.js');
var mongoose = require('mongoose');
/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
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
      //console.log(req.body);
      userModel.findOne({ 'provider_id': req.body.provider_id}, function(err,user) { 
        if(err) { 
          return res.json(500, {message: 'Error '});
        }
        console.log(user);
        if(!err && user != null) {
          return res.json(409, {message: 'User already exists '});
        }
        var user = new userModel({
          provider_id	: req.body.provider_id,
          provider		: req.body.provider,
          name			  : req.body.name,
          photo				: req.body.photo,
          email       : req.body.email
        });

        user.save(function(err) {
          if(err) {
            throw err;
          }
          return res.status(200).json(user);
        });
      });
    }
};
