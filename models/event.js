var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

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
  console.log(twoHoursAgo);
  return Event.find({ datetime: { $gte: ''} }).populate('place').sort('datetime');
};

/**
 * Gets the last 50 events that where scheduled before 2 hours ago.
 *
 * @return A promise with the signature (events: [Event])
 */
EventSchema.statics.getPastEvents = function () {
  var twoHoursAgo = moment().subtract(1, 'hour').toDate();
  return Event.find({ datetime: { $lt: twoHoursAgo } }).populate('place').sort('-datetime').limit(50);
};

var Event = mongoose.model('Event', EventSchema);
module.exports = Event;
