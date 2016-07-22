var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Transaction = require('lx-mongoose-transaction')(mongoose);

var RideRequestSchema = new Schema({
  passenger: { type: ObjectId, ref: 'User' },
  place: { type: ObjectId, ref: 'Place'},
  ride: { type: ObjectId, ref: 'Ride' },
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
    console.log(passenger, this.ride.passengers);
    transaction.update('Ride', {_id: this.ride._id}, {passengers: this.ride.passengers});
    transaction.remove('RideRequest', this._id);
    return transaction.run();

};

RideRequestSchema.methods.reject = function (userId) {
  return this.remove();
};

module.exports = mongoose.model('RideRequest', RideRequestSchema);
