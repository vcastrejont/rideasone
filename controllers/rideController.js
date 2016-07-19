var Event = require('../models/event.js');
var Ride = require('../models/ride.js');
var RideRequest = require('../models/rideRequest.js');
var mailerController = require('../controllers/mailerController.js');
var mongoose = require('mongoose');
var Transaction = require('lx-mongoose-transaction')(mongoose);
var _ = require('lodash');

/**
 * eventController.js
 *
 * @description :: Server-side logic for managing events.
 */

module.exports = {
  deleteRide: function (req, res) {
    var transaction = new Transaction();
    
    Event.findOne({_id: req.params.event_id})
    .then(event => {
      var rideId = req.params.ride_id;
      _.pullAt(event.going_rides, event.going_rides.indexOf(rideId));
      _.pullAt(event.returning_rides, event.returning_rides.indexOf(rideId))
      var updatedRides = {
        going_rides: event.going_rides,
        returning_rides: event.returning_rides
      };
      transaction.update('Event', event._id, updatedRides);
      transaction.remove('Ride', rideId);
      return transaction.run();
    })
    .then(results => {
    var numAffected = results.length;
      console.log(numAffected);
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
    var transaction = new Transaction();
    RideRequest.findOne({_id: req.params.request_id})
    .populate('ride')
    .then(request => {
      var passenger = {
        user: request.passenger,
        place: request.place
      };
      var updatedPassengers = request.ride_id.passengers;
      updatedPassengers.push(passenger);
      transaction.update('Ride', request.ride_id, {passengers: updatedPassengers});
      transaction.remove('RideRequest', request._id);
      return transaction.run();
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
