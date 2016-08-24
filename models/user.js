var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Transaction = require('lx-mongoose-transaction')(mongoose);
var Place = require('./place');
var Event = require('./event');
var error = require('../lib/error');
var util = require('../lib/util');

var UserSchema = new Schema({
  name: String,
  provider: String,
  provider_id: {type: String, unique: true},
  photo: String,
  email: String,
  fcm_tokens: [String],
  created_at: {type: Date, default: Date.now},
  default_place: {type: Schema.Types.ObjectId, ref: 'place'}
});

UserSchema.virtual('profile').get(function () {
  return {
    _id: this.id,
    name: this.name,
    email: this.email,
    photo: this.photo
  };
});

/**
 * Gets all the events in which the user is either the organizer or the driver of one of the rides
 *
 * @return Apromise with signature (events: [Event])
 */
UserSchema.methods.getEvents = function () {
  var Event = require('./event');
  var Ride = require('./ride');
  var moment = require('moment');

  var today = moment().startOf('day').toDate();
  return Ride
    .find({ driver: this })
    .then(rides => {
      return Event
        .find({ datetime: { $gte: today } })
        .or([
          { organizer: this },
          { going_rides: { $in: rides } },
          { returning_rides: { $in: rides } }
        ])
        .populate('organizer', '_id name photo')
        .populate('place')
        .populate({
          path: 'going_rides', 
          populate: {
            path: 'driver passengers',
            populate: {
              path: 'user place',
              select: '_id name photo'
            }
          }
        })
        .sort('datetime');
    });
};

/**
 *
 * @returns A promise with signature (event: Event)
 */

UserSchema.methods.updateFcmToken = function (data) {
  this.fcm_tokens.pull(data.old);
  this.fcm_tokens.push(data.active);
  return this.save();
};

UserSchema.methods.createEvent = function (data) {
  var transaction = new Transaction();

  return util.findOrCreatePlace(data.place, transaction)
  .then(places => {
    var event = {
      place: places[0]._id,
      organizer: this,
      name: data.name,
      description: data.description,
      starts_at: data.starts_at,
      ends_at: data.ends_at,
      tags: data.tags
    };
    transaction.insert('event', event);
    return transaction.run()
  })
  .then(ev => ev[0]._doc)
  .catch(err => {throw new Error(error.toHttp(err))});

};

UserSchema.methods.requestJoiningRide = function (rideId, place) {
  var RideRequest = require('./rideRequest');
  var Notification = require('./notification');
  var transaction = new Transaction();

  return util.findOrCreatePlace(place, transaction)
    .then(places => {
      var request = {
        ride: rideId,
        passenger: this,
        place: places[0]._id
      };
      transaction.insert('riderequest', request);
      return transaction.run(); 
    })
    .then(requests => {
      return requests[0].populate('ride').populate('driver');
    })
    .then(request => {
      var notificationData = {
	      recipient: {
		      tokens: request.ride.driver.tokens,
  		    id: request.ride.driver._id,
	      },
	      message: this.name +' is requesting to join your ride',
		    subject: request._id,
		    type: 'ride request'
	    };

      return Notification.addNotification(notificationData)
        .return(request);
    })
    .catch(err => {throw new Error(error.toHttp(err))});
};

UserSchema.methods.isPassenger = function (rideId) {
  var Ride = require('../models/ride');
  return Ride.findOne({_id: rideId, 'passengers.user': this})
    .then(ride => {
      if (!ride) {
        throw new Error(error.http(403, 'user is not a passenger of this ride'));
      }
      return ride;
    });
};

UserSchema.methods.isDriver = function (rideId) {
  var Ride = require('../models/ride');
  return Ride.findOne({ _id: rideId, driver: this })
    .then(ride => {
      if (!ride) {
        throw new Error(error.http(403, 'user is not the driver of this ride'));
      }
      return ride;
    });
};

UserSchema.methods.isOrganizer = function (eventId) {
  var Event = require('../models/event');
  return Event.findOne({ _id: eventId, organizer: this._id})
    .then((event) => {
      if (!event) {
        throw new Error(error.http(403, 'user is not the organizer of this event or event doesn\'t exist'));
      }
      return event;
    });
};

module.exports = mongoose.model('user', UserSchema);

