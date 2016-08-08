var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Transaction = require('lx-mongoose-transaction')(mongoose);
var Place = require('./place');
var Event = require('./event');

var UserSchema = new Schema({
  name: String,
  provider: String,
  provider_id: {type: String, unique: true},
  photo: String,
  email: String,
  created_at: {type: Date, default: Date.now},
  default_place: {type: Schema.Types.ObjectId, ref: 'place'}
});

UserSchema.virtual('profile').get(function () {
  return {
    _id: this.id,
    name: this.name,
    email: this.email,
    photo: this.photo
  };
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
    .find({ driver: this })
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

/*ToDo: this probably goes somewhere else*/
function findOrCreatePlace(data, transaction){
  return Place.findOne({google_places_id: data.google_places_id})
    .then(place =>{
      if (!place){
		transaction.insert('Place', place);
		return transaction.run();
      } else {
        return place
	  }
  });
};

/**
 * Creates a new event and sets the user as the organizer.
 *
 * @returns A promise with signature (event: Event)
 */
UserSchema.methods.createEvent = function (data) {
  var transaction = new Transaction();

	return findOrCreatePlace(data, transaction)
	.then(places => {
		var event = {
			place: places[0]._id,
			organizer: this,
			name: data.name,
			description: data.description,
			starts_at: data.starts_at,
			ends_at: data.ends_at,
			tags: data.tags
		};
		transaction.insert('Event', event);
		return transaction.run()
		.then(ev => ev[0]._doc); 
	});

};

UserSchema.methods.requestJoiningRide = function (rideId) {
  var RideRequest = require('./rideRequest');
  var request = new RideRequest({
    ride: rideId,
    passenger: this,
    place: this.default_place
  });
  // TODO: Create driver notification
  return request.save();
};

UserSchema.methods.isPassenger = function (rideId) {
  var Ride = require('../models/ride');
  return Ride.findOne({_id: rideId, 'passengers.user': this})
    .then(ride => {
      if (!ride) {
        var error = new Error('User is not a passenger on this ride');
        error.status = 403;
        throw error;
      }
      return ride;
    });
};

UserSchema.methods.isDriver = function (rideId) {
  var Ride = require('../models/ride');
  return Ride.findOne({ _id: rideId, driver: this })
    .then(ride => {
      if (!ride) {
        var error = new Error('User is not the driver on this ride');
        error.status = 403;
        throw error;
      }
      return ride;
    });
};

UserSchema.methods.isOrganizer = function (eventId) {
  var Event = require('../models/event');
  return Event.findOne({ _id: eventId, organizer: this })
    .then((event) => {
      if (!event) {
        var error = new Error('User is not the organizer of this event');
        error.status = 403;
        throw error;
      }
      return event;
    });
};

module.exports = mongoose.model('user', UserSchema);
