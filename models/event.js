var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var EventSchema = new Schema({
  location: { type: [Number], required: true }, // [Long, Lat]
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

module.exports = mongoose.model('event', EventSchema);
