var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var chatSchema = new Schema({
  ride_id: String,
  messages: [{
    content: String,
    username: String,
    created_at: {
      type: Date,
      default: Date.now
    },
  }],
	created_at: {
    type: Date,
    default: Date.now
  },
	updated_at: {
    type: Date,
    default: Date.now
  }
});

chatSchema.pre('save', function(next) {
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

module.exports = mongoose.model('chat', chatSchema);
