var Event = require('../models/event');
var Ride = require('../models/ride');
var RideRequest = require('../models/rideRequest');
var mailerController = require('../controllers/mailerController');
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
      .catch(next);
  },
  
  joinRide: function (req, res, next) {
    req.user.requestJoiningRide(req.params.ride_id, req.body.place)
      .then(ride => {
        return res.status(200).json({
          message: 'Successfully added!'
        });
      })
      .catch(next);
  },
  getByUser: function (req, res, next) {
    var userId = req.user._id;
    return Ride.find({$or: [{driver: userId}, {passengers:{$elemMatch: {user: userId}}}]})
      .populate('driver', 'name photo email _id')
      .populate('place')
      .populate({
        path: 'passengers.user passengers.place',
        select: 'name email photo _id location address google_places_id'
      })
      .then(rides => {
        return res.status(200).json(rides)
      })
      .catch(next);
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
    .catch(next);
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
    .catch(next);
    
  }
};
