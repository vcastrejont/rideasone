var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var eventSchema = new Schema({
  location			: {type: [Number], required: true}, // [Long, Lat]
  address 			 : String,
  place          : String,
  place_id       : String,
	organizer_id   : ObjectId,
  organizer      : String,
  name           : String,
	description    : String,
	category       : String,
  datetime       : Date,
  tags           : [{tag: String }],
  attendees	     : [{
                  user_id  : ObjectId,
                  user     : String,
                  lift     : Boolean, // They need a lift? (Optional)
									n_seats  : Number,
									passanger: [{user_id :ObjectId, name: String}],
		              comments : String
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
