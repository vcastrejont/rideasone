var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var RideSchema = new Schema({
  meetingPoint: {
    name: String,
    address: String,
    location: { type: [Number], required: true }
  },
  driver: { type: ObjectId, ref: 'user', required: true },
  seats: Number,
  comments: String,
  passengers: [{ type: ObjectId, ref: 'user' }],
  chat: [{ type: ObjectId, ref: 'message' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

RideSchema.methods.postMessage = function (userId, text) {
  return new Promise((resolve, reject) => {
    var Message = require('./message');
    var message = new Message({
      author: userId,
      content: text
    });
    message.save()
      .then(() => {
        this.chat.push(message);
        return this.save();
      })
      .then(resolve)
      .catch(reject);
  });
};

module.exports = mongoose.model('ride', RideSchema);
