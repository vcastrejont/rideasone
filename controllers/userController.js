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
};
