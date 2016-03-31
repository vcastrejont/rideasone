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
    }
};
