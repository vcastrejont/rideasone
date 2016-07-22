var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Transaction = require('lx-mongoose-transaction')(mongoose);
var Promise = require('bluebird');
var Ride = require('./Ride');

var EventSchema = new Schema({
  place: { type: ObjectId, ref: 'place' },
  organizer: { type: ObjectId, ref: 'user' },
  name: String,
  description: String,
  datetime: Date,
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
  return Event.find({ datetime: { $gte: twoHoursAgo} }).populate('Place').sort('datetime');
};

/**
 * Gets the last 50 events that where scheduled before 2 hours ago.
 *
 * @return A promise with the signature (events: [Event])
 */
EventSchema.statics.getPastEvents = function () {
  var twoHoursAgo = moment().subtract(1, 'hour').toDate();
  return Event.find({ datetime: { $lt: twoHoursAgo } }).populate('Place').sort('-datetime').limit(50);
};

function createRide(ride, path, transaction) {
  transaction.insert('Ride', ride);
  return transaction.run()
    .then(createdRides => {
      this[path].push({_id: createdRides[0]._id});
    });
}

EventSchema.methods.addRide = function (rideData) {
  var transaction = new Transaction();

  var ride= {
		driver_id: rideData.driver,
    seats: rideData.seats,
    comments: rideData.comments
  };

  var promises = [];
  if(rideData.going === true){
    promises.push(createRide.call(this, ride, 'going_rides', transaction)); 
  }
  if(rideData.returning === true){
    promises.push(createRide.call(this, ride, 'returning_rides', transaction));
  }

  return Promise.all(promises)
    .then(() => {
      transaction.update('Event', {'_id': this._id}, {
        going_rides: this.going_rides, 
        returning_rides: this.returning_rides
      });
      return transaction.run()
    });

};


var Event = mongoose.model('Event', EventSchema);
module.exports = Event;
