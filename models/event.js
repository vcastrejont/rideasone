var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var EventSchema = new Schema({
  place: { type: ObjectId, ref: 'place' },
  organizer: { type: ObjectId, ref: 'user' },
  name: String,
  description: String,
  category: String,
  datetime: Date,
  tags: [{ tag: String }],
  going_rides: [{ type: ObjectId, ref: 'ride' }],
  returning_rides: [{ type: ObjectId, ref: 'ride' }],
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

/**
 * Gets all of the events scheduled from 2 hours ago until the end of time.
 *
 * @return A promise with the signature (events: [Event])
 */
EventSchema.statics.getCurrentEvents = function () {
  var twoHoursAgo = moment().subtract(1, 'hour').toDate();
  return Event.find({ datetime: { $gte: twoHoursAgo } }).sort('datetime');
};

/**
 * Gets the last 50 events that where scheduled before 2 hours ago.
 *
 * @return A promise with the signature (events: [Event])
 */
EventSchema.statics.getPastEvents = function () {
  var twoHoursAgo = moment().subtract(1, 'hour').toDate();
  return Event.find({ datetime: { $lt: twoHoursAgo } }).sort('-datetime').limit(50);
};

var Event = mongoose.model('event', EventSchema);
module.exports = Event;
