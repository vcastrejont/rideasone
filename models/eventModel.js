var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var eventSchema = new Schema({
  location			 : {type: [Number], required: true}, // [Long, Lat]
  address 			 : String,
  place          : String,
  place_id       : String,
  // TODO: Rename this field to just "organizer"
	organizer_id   : { type: ObjectId, ref: 'user' },
  name           : String,
	description    : String,
	category       : String,
  datetime       : Date,
  tags           : [{ tag: String }],
  // SUGGESTION: Separate cars into its own model. Maybe call it "trip"
  // This will make it way easier when you want to get all trips available for a single event.
  // Uncomment below:
  // trips : { type: ObjectId, ref: 'trip' },
  cars           : [{
    type         : Number, // See TripType enum below
    meeting_point: {
      time       : Date,
      location   : [Number],
      address    : String,
      place      : String,
      place_id   : String
    },
    // TODO: Link to a user instead of duplicating the driver's fields. Uncomment line below:
    // driver: { type: ObjectId, ref: 'user' },
    // TODO: ...and delete the following 4
    driver_name  : String,
    driver_id    : ObjectId,
    driver_email : String,
    driver_photo : String,
    seats        : Number,
    comments     : String,
    // TODO: Link passengers to users. Uncomment line below:
    // passengers: [{ type: ObjectId, ref: 'user' }],
    // TODO: ...and delete the following 6:
    passengers   : [{
      passenger_name  : String,
      passenger_id    : ObjectId,
      passenger_photo : String,
      passenger_email : String
    }]
  }],               									
	created_at		: {type: Date, default: Date.now},
	updated_at		: {type: Date, default: Date.now}
});

eventSchema.statics.TripType = {
  GOING: 0,
  RETURNING: 1
};

module.exports = mongoose.model('event', eventSchema);
