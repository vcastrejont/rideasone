var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  provider: String,
  provider_id: {type: String, unique: true},
  photo: String,
  email: String,
  createdAt: {type: Date, default: Date.now},
  defaultPlace: { type: ObjectId, ref: 'place' }
});

/**
 * Gets all the events in which the user is either the organizer or the driver of one of the rides
 *
 * @return Apromise with signature (events: [Event])
 */
UserSchema.methods.getEvents = function () {
  var Event = require('./event');
  var Ride = require('./ride');
  var moment = require('moment');

  var today = moment().startOf('day').toDate();
  return Ride
    .find({ driver: user })
    .then((rides) => {
      return Event
        .find({ datetime: { $gte: today } })
        .or([
          { organizer: this },
          { going_rides: { $in: rides } },
          { returning_rides: { $in: rides } }
        ])
        .populate('place')
        .sort('datetime');
    });
};

/**
 * Creates a new event and sets the user as the organizer.
 *
 * @returns A promise with signature (event: Event)
 */
UserSchema.methods.createEvent = function (data) {
  var Event = require('./event');
  var Place = require('./place');
  var place = new Place({
    location: {
      lat: data.location.lat,
      lon: data.location.lon
    },
    address: data.address,
    name: data.place,
    place_id: data.place_id
  });
  var event = new Event({
    place: place,
    organizer: this,
    name: data.name,
    description: data.description,
    datetime: data.datetime,
    tags: data.tags
  });
  return place.save()
    .then( place => event.save() );
};

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
