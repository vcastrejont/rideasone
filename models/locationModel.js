var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
  name: {type: String, required: true},
  location: {type: [Number], required: true}, // [Long, Lat]
  address: {type: String},
  url: {type: String},
  phone: {type: String},
  place_id: {type: String},
  place_url: {type: String},
  default_place: {type: Boolean},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

locationSchema.index({location: '2dsphere'});

module.exports = mongoose.model('location', locationSchema);
