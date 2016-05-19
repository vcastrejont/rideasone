var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var eventSchema = new Schema({
  location			: {type: [Number], required: true}, // [Long, Lat]
  address 			 : String,
  place          : String,
  place_id       : String,
	organizer_id   : ObjectId,
  name           : String,
	description    : String,
	category       : String,
  datetime       : Date,
  tags           : [{tag: String }],
  cars           : [{
    driver_name  : String,
    driver_id    : ObjectId,
    driver_email : String,
    driver_photo : String,
    seats        : Number,
    comments     : String,
    passengers   : [{
      passenger_name  : String, 
      passenger_id    :ObjectId, 
      passenger_photo :  String,
      passenger_email :  String
    }]
  }],               									
	created_at		: {type: Date, default: Date.now},
	updated_at		: {type: Date, default: Date.now}
});

eventSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

module.exports = mongoose.model('event', eventSchema);
