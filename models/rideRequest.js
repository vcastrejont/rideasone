var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Transaction = require('lx-mongoose-transaction')(mongoose);
var Notification = require('./notification');

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
  transaction.remove('riderequest', this._id);
  return transaction.run()
   .then(results => {
      var notificationData = {
        recipient: {
          tokens: this.passenger.tokens,
          id: this.passenger._id.toString(),
        },
        message: this.name +' has accepted to give you a ride',
        subject: this.ride._id,
        type: 'ride acceptance'
      };
  
      return Notification.addNotification(notificationData, transaction);
  });

};

RideRequestSchema.methods.reject = function (userId) {
  return this.remove();
};

module.exports = mongoose.model('riderequest', RideRequestSchema);
