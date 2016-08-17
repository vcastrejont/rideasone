var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Transaction = require('lx-mongoose-transaction')(mongoose);

var RideRequestSchema = new Schema({
  passenger: { type: ObjectId, ref: 'user' },
  place: { type: ObjectId, ref: 'place'},
  ride: { type: ObjectId, ref: 'ride' },
  created_at: { type: Date, default: Date.now }
});

/**
 * Accepts the request by adding the passenger to the ride and then deleting itself
 *
 * @return a Promise
 */
RideRequestSchema.methods.accept = function () {
    var transaction = new Transaction();

    var passenger = {
      user: this.passenger,
      place: this.place
    };
    
    this.ride.passengers.push(passenger);
    transaction.update('ride', {_id: this.ride._id}, {passengers: this.ride.passengers});
    transaction.remove('rideRequest', this._id);
    return transaction.run()
      .catch(err => {throw new Error(error.toHttp(err));});

};

RideRequestSchema.methods.reject = function (userId) {
  return this.remove();
};

module.exports = mongoose.model('rideRequest', RideRequestSchema);
