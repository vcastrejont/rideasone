var Event = require('../models/event.js');
var Ride = require('../models/ride.js');
var RideRequest = require('../models/rideRequest.js');
var mailerController = require('../controllers/mailerController.js');
var mongoose = require('mongoose');
var Transaction = require('lx-mongoose-transaction')(mongoose);
var error = require('../lib/error');
var _ = require('lodash');

module.exports = {
  deleteRide: function (req, res, next) {
    req.ride.deleteEventRide(req.params.event)
      .then(results => {
        var numAffected = results.length;
        return res.status(200).json({
          message: 'Successfully deleted',
        });
      })
      .catch(err => next);
  },
  
  joinRide: function (req, res, next) {
    req.user.requestJoiningRide(req.params.ride_id)
      .then(ride => {
        return res.status(200).json({
          message: 'Successfully added!'
        });
      })
      .catch(err => next);
  },
  addPassenger: function (req, res) {
    var event_id = req.body.event_id;
    var car_id = req.body.car_id;
    var extra = req.body.extra;
    var passenger = {
      user_id: req.user.id,
      name: req.user.name,
      photo: req.user.photo
    };
    for (i = 0; i < extra; i++) {
      Event.update({_id: event_id, 'cars._id': car_id },
        {'$push': {'cars.$.passengers': passenger}},
        function (err, numAffected) {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Error updating event', error: err
            });
          } else {
            // nothing here
          }
        });
    }
    return res.status(200).json({
      message: 'Successfully added!'
    });

  },
  leaveRide: function (req, res, next) {
    req.ride.update({'$pull': {'passengers': {'user_id': req.user._id}}})
    .then(numAffected => {
      /*toDo: notify driver*/
      return res.status(200).json({
        message: 'Successfully removed',
      });
    })
    .catch(err => next);
  },
  acceptRideRequest: function (req, res, next) {
    RideRequest.findOne({_id: req.params.request_id, ride: req.params.ride_id})
    .populate('ride')
    .then(request => {
      return request.accept();
    })
    .then(results => {
      return res.status(200).json({
        message: 'successfully accepted ride',
      });
    })
    .catch(err => next);
    
  }
};
