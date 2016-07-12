var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var RideRequestSchema = new Schema({
  passenger: { type: ObjectId, ref: 'User' },
  ride: { type: ObjectId, ref: 'Ride' },
  created_at: { type: Date, default: Date.now }
});

/**
 * Accepts the request by adding the passenger to the ride and then deleting itself
 *
 * @return a Promise
 */
RideRequestSchema.methods.accept = function (userId, text) {
  return new Promise((resolve, reject) => {
    var Ride = require('./ride');
    return Ride.findById(this.ride)
      .then(ride => {
        ride.passengers.push(this.passenger);
        return ride.save();
      })
      .then(() => {
        return this.remove();
      })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * Rejects the request by deleting itself
 *
 * @return a Promise
 */
RideRequestSchema.methods.reject = function (userId) {
  return this.remove();
};

module.exports = mongoose.model('RideRequest', RideRequestSchema);
