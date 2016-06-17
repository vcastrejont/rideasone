var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  provider: String,
  provider_id: {type: String, unique: true},
  photo: String,
  email: String,
  createdAt: {type: Date, default: Date.now}
});

UserSchema.methods.requestJoiningRide = function (rideId) {
  var RideRequest = require('./rideRequest');
  var request = new RideRequest({
    ride: rideId,
    passenger: this
  });
  // TODO: Create driver notification
  return request.save();
};

module.exports = mongoose.model('user', UserSchema);
