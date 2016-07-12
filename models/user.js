var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Transaction = require('lx-mongoose-transaction')(mongoose);
var Event = require('./event');
var Place = require('./place');

var UserSchema = new Schema({
  name: String,
  provider: String,
  provider_id: {type: String, unique: true},
  photo: String,
  email: String,
  created_at: {type: Date, default: Date.now},
  default_place: {type: Schema.Types.ObjectId, ref: 'place'}
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

/*ToDo: this probably goes somewhere else*/
function findOrCreatePlace(data, transaction){
  if (data.location && ! data.place){
    var place = {
			location: {
				lat: data.location.lat,
				lon: data.location.lon
			},
				address: data.address,
				name: data.place,
				place_name: data.place_name
    };
		transaction.insert('Place', place);
		return transaction.run();
  } else {
    return Place.find({_id: data.place});
  }
}

/**
 * Creates a new event and sets the user as the organizer.
 *
 * @returns A promise with signature (event: Event)
 */
UserSchema.methods.createEvent = function (data) {
  var transaction = new Transaction();

	return findOrCreatePlace(data, transaction)
	.then((places) => {
		var event = {
			place: places[0],
			organizer: this,
			name: data.name,
			description: data.description,
			datetime: data.datetime,
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
    passenger: this
  });
  // TODO: Create driver notification
  return request.save();
};

UserSchema.methods.acceptRide = function (rideId) {
  var RideRequest = require('./rideRequest');
  var request = new RideRequest({
    ride: rideId,
    passenger: this
  });
  // TODO: Create driver notification
  return request.save();
};

module.exports = mongoose.model('user', UserSchema);
