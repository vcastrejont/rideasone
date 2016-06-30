var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var EventSchema = new Schema({
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  address: String,
  place: String,
  place_id: String,
  organizer: { type: ObjectId, ref: 'user' },
  name: String,
  description: String,
  category: String,
  datetime: Date,
  tags: [{ tag: String }],
  goingRides: [{ type: ObjectId, ref: 'ride' }],
  returningRides: [{ type: ObjectId, ref: 'ride' }],
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

/**
 * Gets all the events scheduled since yesterday to the end of times.
 *
 * @return A promise with the signature (events: [Event])
 */
EventSchema.statics.getEventsSinceYesterday = function () {
  var yesterday = moment().add(1, 'day').toDate();
  return Event.find({ datetime: { $gte: yesterday } }).sort('datetime').limit(5);
};

EventSchema.statics.getEventsSinceYesterday = function () {
  var yesterday = moment().add(1, 'day').toDate();
  return Event.find({ datetime: { $lt: yesterday } }).sort('-datetime').limit(5);
};

var Event = mongoose.model('event', EventSchema);
module.exports = Event;
