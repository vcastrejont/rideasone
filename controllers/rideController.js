var Event = require('../models/event.js');
var Ride = require('../models/ride.js');
var RideRequest = require('../models/rideRequest.js');
var mailerController = require('../controllers/mailerController.js');
var mongoose = require('mongoose');
var Transaction = require('lx-mongoose-transaction')(mongoose);
var _ = require('lodash');

module.exports = {
  deleteRide: function (req, res) {
    req.ride.deleteEventRide(req.params.event)
      .then(results => {
        var numAffected = results.length;
        return res.status(200).json({
          message: 'Successfully deleted',
          numAffected: numAffected
        });
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json({
        message: 'Error updating event', error: err
        });
      });
  },
  
  joinRide: function (req, res) {
    req.user.requestJoiningRide(req.params.ride_id)
      .then(ride => {
        return res.status(200).json({
          message: 'Successfully added!'
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Error requesting ride', error: err
        });
      });
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
  leaveRide: function (req, res) {
    req.ride.update({'$pull': {'passengers': {'user_id': req.user._id}}})
    .then(numAffected => {
      /*toDo: notify driver*/
      //mailerController.leaveCar(passenger.passenger_name, event.name, car[0].driver_email);
      //ToDo: 404

      return res.status(200).json({
        message: 'Successfully removed',
        numAffected: numAffected
      });
    })
    .catch(err => {
       return res.status(500).json({
        message: 'Error updating ride', error: err
      });
    });
  },
  acceptRideRequest: function (req, res) {
    RideRequest.findOne({_id: req.params.request_id})
    .populate('ride')
    .then(request => {
      return req.user.isDriver(request.ride._id)
      .return(request);
    })
    .then(request => {
      return request.accept();
    })
    .then(results => {
      return res.status(200).json({
        message: 'successfully accepted ride',
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message: 'Error updating ride',
        error: err
      });
    });
    
  }
};
