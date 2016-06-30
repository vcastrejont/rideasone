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
 * Gets the first 5 events scheduled from 2 hours ago until the end of time.
 *
 * @return A promise with the signature (events: [Event])
 */
EventSchema.statics.getCurrentEvents = function () {
  var twoHoursAgo = moment().subtract(1, 'hour').toDate();
  return Event.find({ datetime: { $gte: twoHoursAgo } }).sort('datetime').limit(5);
};

/**
 * Gets the last 5 events that where scheduled before 2 hours ago.
 *
 * @return A promise with the signature (events: [Event])
 */
EventSchema.statics.getPastEvents = function () {
  var twoHoursAgo = moment().subtract(1, 'hour').toDate();
  return Event.find({ datetime: { $lt: twoHoursAgo } }).sort('-datetime').limit(5);
};

var Event = mongoose.model('event', EventSchema);
module.exports = Event;
