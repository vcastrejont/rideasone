var chatModel = require('../models/chatModel.js');
var mongoose = require('mongoose');

/**
 * chatController.js
 *
 * @description :: Server-side logic for managing chat messaging.
 *
 */

module.exports = {
  /**
   * chatController.addMessage()
   */
  addMessage: function(req, res) {
    var rideId = req.body.rideId,
    msg = req.body.message;

    chatModel.findOne({
      "ride_id": rideId
    },
    function(err, data) {

      if(err) {
        return res.status(500).json({
          message: err
        });
      }
      else if(!data) {
        createChatroom(rideId, function(error, chat) {

          if(error) {
            return res.status(500).json({
              message: error
            });
          }

          saveMessage(chat._id, msg, function(error, model) {

            if(err) {
              return res.status(500).json({
                message: error
              });
            }
            else {
              return res.status(200).json(model);
            }
          });
        });
      }
      else {
        saveMessage(data._id, msg, function(error, model) {

          if(err) {
            return res.status(500).json({
              message: error
            });
          }
          else {
            return res.status(200).json(model);
          }
        });
      }
    });
  }
};

function createChatroom(rideId, cb) {

  var chat = new chatModel({
    ride_id: rideId
  });

  chat.save(function(error, chat) {

    cb(error, chat);
  });
}

function saveMessage(chatId, msg, cb) {

  chatModel.findByIdAndUpdate(
    chatId, { $push: { "messages": msg } },
    { safe: true, upsert: true },
    function(err, model) {

      cb(err, model);
    }
  );
}
