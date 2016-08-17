var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Transaction = require('lx-mongoose-transaction')(mongoose);
var Promise = require('bluebird');
var Ride = require('./ride');
var _ = require('lodash');
var util = require('util');

var EventSchema = new Schema({
  place: { type: ObjectId, ref: 'place' },
  organizer: { type: ObjectId, ref: 'user' },
  name: String,
  description: String,
  starts_at: {type: Date, required: true},
  ends_at: Date,
  tags: Array,
  going_rides: [{ type: ObjectId, ref: 'ride' }],
  returning_rides: [{ type: ObjectId, ref: 'ride' }],
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

/**
 * Gets all of the events scheduled for 2 hours ago and later.
 *
 * @return A promise with the signature (events: [Event])
 */
EventSchema.statics.getCurrentEvents = function () {
  var twoHoursAgo = moment().subtract(2, 'hour').toDate();
  return Event.find({ starts_at: { $gte: twoHoursAgo} })
    .populate('place')
    .populate('organizer', '_id name photo')
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
    .sort('starts_at');
};

/**
 * Gets the last 50 events that where scheduled before 2 hours ago.
 *
 * @return A promise with the signature (events: [Event])
 */
EventSchema.statics.getPastEvents = function () {
  var twoHoursAgo = moment().subtract(1, 'hour').toDate();
  return Event.find({ starts_at: { $lt: twoHoursAgo } })
  .populate('place')
	.populate('organizer')
	.populate({
	  path: 'going_rides', 
      populate: {
        path: 'driver passengers',
        populate: {
          path: 'user place',
          select: '_id name email'
        }
      }
	})
	.sort('-starts_at').limit(50);
};

function createRide(ride, path, transaction) {
  return util.findOrCreatePlace(ride.place, transaction)
    .then(places => {
      ride.place = places[0]._id;
      transaction.insert('ride', ride);
      return transaction.run()
    })
    .then(createdRides => {
      this[path].push({_id: createdRides[0]._id});
    })
    .catch(err => {throw new Error(error.toHttp(err))});
}

EventSchema.methods.addRide = function (rideData) {
  var transaction = new Transaction();

  var ride = _.omit(rideData, ['going', 'returning']);

  var promises = [];
  if(rideData.going === true){
    promises.push(createRide.call(this, ride, 'going_rides', transaction)); 
  }
  if(rideData.returning === true){
    promises.push(createRide.call(this, ride, 'returning_rides', transaction));
  }

  return Promise.all(promises)
    .then(() => {
      transaction.update('event', {'_id': this._id}, {
        going_rides: this.going_rides, 
        returning_rides: this.returning_rides
      });
      return transaction.run()
      .catch(err => {throw new Error(error.toHttp(err))});
    });

};


var Event = mongoose.model('event', EventSchema);
module.exports = Event;
