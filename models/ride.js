var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Transaction = require('lx-mongoose-transaction')(mongoose);
var Promise = require('bluebird');
var error = require('../lib/error');

var RideSchema = new Schema({
  place: { type: ObjectId, ref: 'place' },
  driver: { type: ObjectId, ref: 'user', required: true },
  departure: Date,
  seats: Number,
  comment: String,
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

function appendEvent(ride){
  var Event = require('./event');
  var query = {$or:[
   {going_rides: ride._id}, 
   {returning_rides: ride._id}
  ]};

  var promise = Event.findOne(query)
    .then(event => {ride._doc.event = event._id;});

  return promise;
}

RideSchema.statics.getUserRides = function (userId) {
  var query = {
    departure: {$gt: new Date().toUTCString()},
    $or: [
      {driver: userId},
      {passengers: {$elemMatch: {$elemMatch: {user: userId}}}}
    ]
  };

  return Ride.find(query)
    .populate('driver', 'name photo email _id')
    .populate('place')
    .populate({
      path: 'passengers.user passengers.place',
      select: 'name email photo _id location address google_places_id'
    })
    .sort('departure')
    .then(rides => {
      var promises = [];

      rides.forEach((ride, i) => {
        promises.push(appendEvent(ride));
      });
      return Promise.all(promises).return(rides);
    });

}
RideSchema.methods.deleteEventRide = function(event) {
  var Event = require('./event');
  var transaction = new Transaction();
 
  return Event.findOne({_id: event._id})
  .then(event => {
    if(!event) throw error.http(404, "the event doesn't exist"); 
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
  })
  .catch(err => {throw new Error(err.toHttp(err))});
}

var Ride = module.exports = mongoose.model('ride', RideSchema);
