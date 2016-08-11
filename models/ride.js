var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Transaction = require('lx-mongoose-transaction')(mongoose);
var Promise = require('bluebird');

var RideSchema = new Schema({
  place: { type: ObjectId, ref: 'place' },
  driver: { type: ObjectId, ref: 'user', required: true },
  departure: Date,
  seats: Number,
  comments: String,
  passengers: [{
    _id: false,
    user: { type: ObjectId, ref: 'user' },
    place: { type: ObjectId, ref: 'place' }
  }],
  chat: [{ type: ObjectId, ref: 'message' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

RideSchema.methods.postMessage = function (userId, text) {
  return new Promise((resolve, reject) => {
    var Message = require('./message');
    var message = new Message({
      author: userId,
      content: text
    });
    message.save()
      .then(() => {
        this.chat.push(message);
        return this.save();
      })
      .then(resolve)
      .catch(reject);
  });
};

RideSchema.methods.deleteEventRide = function(event) {
  var Event = require('./event');
  var transaction = new Transaction();
 
  return Event.findOne({_id: event._id})
  .then(event => {
    var promises = [];
    event.going_rides.pull({_id: this._id});
    event.returning_rides.pull({_id: this._id});

    var updatedRides = {
      going_rides: event.going_rides,
      returning_rides: event.returning_rides
    };

    transaction.update('event', event._id, updatedRides);
    transaction.remove('ride', this._id);
    return transaction.run();
  });
}

module.exports = mongoose.model('ride', RideSchema);
