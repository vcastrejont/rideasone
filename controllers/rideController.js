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
    .populate('driver')
	.then(ride => {
      var notificationData = {
	    recipient: {
		  tokens: ride.driver.tokens,
		  id: ride.driver._id,
	    },
	    message: this.name +' has cancelled a spot on your ride',
		subject: ride._id,
		type: 'ride cancellation'
	  };
	  
      return Notification.addNotification(notificationData);
	})
    .then(numAffected => {
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
    var passenger;
    var ride;
	
    RideRequest.findOne({_id: req.params.request_id, ride: req.params.ride_id})
    .populate('ride')
	.populate('passenger')
    .then(request => {
      passenger = request.passenger;
	  ride = request.ride;
      return request.accept();
    })
	.then(results => {
      var notificationData = {
	    recipient: {
		  tokens: passenger.tokens,
		  id: passenger._id,
	    },
	    message: this.name +' has accepted to give you a ride',
		subject: ride._id,
		type: 'ride acceptance'
	  };
	  
      return Notification.addNotification(notificationData);
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
