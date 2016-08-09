var express = require('express');
var router = express.Router();
var eventsController = require('../controllers/eventController.js');
var userController = require('../controllers/userController.js');
var ridesController = require('../controllers/rideController.js');

var middleware = require('../middleware');

router.get('/', function (req, res) {
  res.send('API list');
});

// ----Events --------
  /**
  * @api {get} /api/events All future events
  * @apiName GetFutureEvents
  * @apiGroup Events
  * @apiDescription Returns an array of all events with date greater than yesterday.
  *
* @apiHeader  Authorization                                     JWT token.
* @apiSuccess {ObjectId}  id                                    Mongo generated ID.
* @apiSuccess {String}    name                                  Event name
* @apiSuccess {String}    description                           Event full description
* @apiSuccess {Object}    place                                 Venue (place object)
* @apiSuccess {String}    place.name                            Venue name
* @apiSuccess {String}    place.google_places_id                Venue place id
* @apiSuccess {String}    place.address                         Venue address
* @apiSuccess {String[]}  place.location                        Venue array location (lat, lng)
* @apiSuccess {Object}    organizer                             Organizer full name
* @apiSuccess {String}    category                              Event category
* @apiSuccess {String[]}  tags                                  List of tags (Array of Strings)
* @apiSuccess {Object[]}  going_rides                           Rides going to the event
* @apiSuccess {String}    going_rides.place                     Ride departure location (Place object)
* @apiSuccess {String}    going_rides.driver                    Ride driver (User object)
* @apiSuccess {Date}      going_rides.departure                 Ride departure datetime
* @apiSuccess {String}    going_rides.seats                     Ride number of available seats
* @apiSuccess {String}    going_rides.comments                  Ride driver comments
* @apiSuccess {Object[]}  going_rides.passengers                Ride passengers array
* @apiSuccess {Object}    going_rides.passengers.user           Ride passenger user info (user object)
* @apiSuccess {Object}    going_rides.passengers.place          Ride passenger departure location (place object)
* @apiSuccess {Object[]}  returning_rides                       Rides going from the event
* @apiSuccess {String}    returning_rides.place                     Ride driver destination location (Place object)
* @apiSuccess {String}    returning_rides.driver                    Ride driver (User object)
* @apiSuccess {Date}      returning_rides.departure                 Ride departure datetime
* @apiSuccess {String}    returning_rides.seats                     Ride number of available seats
* @apiSuccess {String}    returning_rides.comments                  Ride driver comments
* @apiSuccess {Object[]}  returning_rides.passengers                Ride passengers array
* @apiSuccess {Object}    returning_rides.passengers.user           Ride passenger user info (user object)
* @apiSuccess {Object}    returning_rides.passengers.place          Ride passenger destination location (place object)
* @apiSuccess {Date}      created_at                            Document creation  date
* @apiSuccess {Date}      updated_at                            Last updated
*/
router.get('/events', middleware.isAuthenticated, eventsController.getFuture);

  /**
  * @api {get} /api/events/past All past events
  * @apiName GetPastEvents
  * @apiGroup Events
  *
  * @apiHeader  Authorization                                     JWT token.
  * @apiSuccess {ObjectId}  id                                    Mongo generated ID.
  * @apiSuccess {String}    name                                  Event name
  * @apiSuccess {String}    description                           Event full description
  * @apiSuccess {Object}    place                                 Venue (place object)
  * @apiSuccess {String}    place.name                            Venue name
  * @apiSuccess {String}    place.google_places_id                Venue place id
  * @apiSuccess {String}    place.address                         Venue address
  * @apiSuccess {String[]}  place.location                        Venue array location (lat, lng)
  * @apiSuccess {Object}    organizer                             Organizer full name
  * @apiSuccess {String}    category                              Event category
  * @apiSuccess {String[]}  tags                                  List of tags (Array of Strings)
  * @apiSuccess {Object[]}  going_rides                           Rides going to the event
  * @apiSuccess {String}    going_rides.place                     Ride departure location (Place object)
  * @apiSuccess {String}    going_rides.driver                    Ride driver (User object)
  * @apiSuccess {Date}      going_rides.departure                 Ride departure datetime
  * @apiSuccess {String}    going_rides.seats                     Ride number of available seats
  * @apiSuccess {String}    going_rides.comments                  Ride driver comments
  * @apiSuccess {Object[]}  going_rides.passengers                Ride passengers array
  * @apiSuccess {Object}    going_rides.passengers.user           Ride passenger user info (user object)
  * @apiSuccess {Object}    going_rides.passengers.place          Ride passenger departure location (place object)
  * @apiSuccess {Object[]}  returning_rides                       Rides going from the event
  * @apiSuccess {String}    returning_rides.place                     Ride driver destination location (Place object)
  * @apiSuccess {String}    returning_rides.driver                    Ride driver (User object)
  * @apiSuccess {Date}      returning_rides.departure                 Ride departure datetime
  * @apiSuccess {String}    returning_rides.seats                     Ride number of available seats
  * @apiSuccess {String}    returning_rides.comments                  Ride driver comments
  * @apiSuccess {Object[]}  returning_rides.passengers                Ride passengers array
  * @apiSuccess {Object}    returning_rides.passengers.user           Ride passenger user info (user object)
  * @apiSuccess {Object}    returning_rides.passengers.place          Ride passenger destination location (place object)
  * @apiSuccess {Date}      created_at                            Document creation  date
  * @apiSuccess {Date}      updated_at                            Last updated
  */
router.get('/events/past', middleware.isAuthenticated, eventsController.getPast);

  /**
  * @api {post} /api/events New event
  * @apiName CreateEvent
  * @apiGroup Events
  * @apiHeader  Authorization                      JWT token.
  * @apiParam {String}    name                     Event name
  * @apiParam {String}    description              Event full description
  * @apiParam {Object}    place                    Event venue
  * @apiParam {String}    place.name               Event venue name
  * @apiParam {String}    place.google_places_id   Event venue place id
  * @apiParam {String}    place.address            Event venue address
  * @apiParam {String[]}  place.location           Event venue array location (lat, lng)
  * @apiParam {Date}      starts_at                Event start dame time
  * @apiParam {Date}      [ends_at]                Event end dame time (optional)
  */
router.post('/events', middleware.isAuthenticated, eventsController.create);

  /**
  * @api {get} /api/events/:event_id Show an event
  * @apiName GetEvent
  * @apiGroup Events
  * @apiDescription Display an event details
  *
  * @apiHeader  Authorization                                     JWT token.
  * @apiSuccess {ObjectId}  id                                    Mongo generated ID.
  * @apiSuccess {String}    name                                  Event name
  * @apiSuccess {String}    description                           Event full description
  * @apiSuccess {Object}    place                                 Venue (place object)
  * @apiSuccess {String}    place.name                            Venue name
  * @apiSuccess {String}    place.google_places_id                Venue place id
  * @apiSuccess {String}    place.address                         Venue address
  * @apiSuccess {String[]}  place.location                        Venue array location (lat, lng)
  * @apiSuccess {Object}    organizer                             Organizer full name
  * @apiSuccess {String}    category                              Event category
  * @apiSuccess {String[]}  tags                                  List of tags (Array of Strings)
  * @apiSuccess {Object[]}  going_rides                           Rides going to the event
  * @apiSuccess {String}    going_rides.place                     Ride departure location (Place object)
  * @apiSuccess {String}    going_rides.driver                    Ride driver (User object)
  * @apiSuccess {Date}      going_rides.departure                 Ride departure datetime
  * @apiSuccess {String}    going_rides.seats                     Ride number of available seats
  * @apiSuccess {String}    going_rides.comments                  Ride driver comments
  * @apiSuccess {Object[]}  going_rides.passengers                Ride passengers array
  * @apiSuccess {Object}    going_rides.passengers.user           Ride passenger user info (user object)
  * @apiSuccess {Object}    going_rides.passengers.place          Ride passenger departure location (place object)
  * @apiSuccess {Object[]}  returning_rides                       Rides going from the event
  * @apiSuccess {String}    returning_rides.place                     Ride driver destination location (Place object)
  * @apiSuccess {String}    returning_rides.driver                    Ride driver (User object)
  * @apiSuccess {Date}      returning_rides.departure                 Ride departure datetime
  * @apiSuccess {String}    returning_rides.seats                     Ride number of available seats
  * @apiSuccess {String}    returning_rides.comments                  Ride driver comments
  * @apiSuccess {Object[]}  returning_rides.passengers                Ride passengers array
  * @apiSuccess {Object}    returning_rides.passengers.user           Ride passenger user info (user object)
  * @apiSuccess {Object}    returning_rides.passengers.place          Ride passenger destination location (place object)
  * @apiSuccess {Date}      created_at                            Document creation  date
  * @apiSuccess {Date}      updated_at                            Last updated
  */
router.get('/events/:event_id', middleware.isAuthenticated, eventsController.getById);

  /**
  * @api {get} /api/users/:user_id/events All user events
  * @apiName GetUserEvents
  * @apiGroup Events
  * @apiDescription List all events from that user
  *
  * @apiHeader  Authorization                                     JWT token.
  * @apiSuccess {ObjectId}  id                                    Mongo generated ID.
  * @apiSuccess {String}    name                                  Event name
  * @apiSuccess {String}    description                           Event full description
  * @apiSuccess {Object}    place                                 Venue (place object)
  * @apiSuccess {String}    place.name                            Venue name
  * @apiSuccess {String}    place.google_places_id                Venue place id
  * @apiSuccess {String}    place.address                         Venue address
  * @apiSuccess {String[]}  place.location                        Venue array location (lat, lng)
  * @apiSuccess {Object}    organizer                             Organizer full name
  * @apiSuccess {String}    category                              Event category
  * @apiSuccess {String[]}  tags                                  List of tags (Array of Strings)
  * @apiSuccess {Object[]}  going_rides                           Rides going to the event
  * @apiSuccess {String}    going_rides.place                     Ride departure location (Place object)
  * @apiSuccess {String}    going_rides.driver                    Ride driver (User object)
  * @apiSuccess {Date}      going_rides.departure                 Ride departure datetime
  * @apiSuccess {String}    going_rides.seats                     Ride number of available seats
  * @apiSuccess {String}    going_rides.comments                  Ride driver comments
  * @apiSuccess {Object[]}  going_rides.passengers                Ride passengers array
  * @apiSuccess {Object}    going_rides.passengers.user           Ride passenger user info (user object)
  * @apiSuccess {Object}    going_rides.passengers.place          Ride passenger departure location (place object)
  * @apiSuccess {Object[]}  returning_rides                       Rides going from the event
  * @apiSuccess {String}    returning_rides.place                     Ride driver destination location (Place object)
  * @apiSuccess {String}    returning_rides.driver                    Ride driver (User object)
  * @apiSuccess {Date}      returning_rides.departure                 Ride departure datetime
  * @apiSuccess {String}    returning_rides.seats                     Ride number of available seats
  * @apiSuccess {String}    returning_rides.comments                  Ride driver comments
  * @apiSuccess {Object[]}  returning_rides.passengers                Ride passengers array
  * @apiSuccess {Object}    returning_rides.passengers.user           Ride passenger user info (user object)
  * @apiSuccess {Object}    returning_rides.passengers.place          Ride passenger destination location (place object)
  * @apiSuccess {Date}      created_at                            Document creation  date
  * @apiSuccess {Date}      updated_at                            Last updated
  */
router.get('/users/:user_id/events', middleware.isAuthenticated, eventsController.getByUser);


/**
 * @api {put} /api/events/:event_id/ Edit event
 * @apiName EditEvent
 * @apiGroup Events
 * @apiDescription Edit an event
 * @apiHeader  Authorization                                     JWT token.
 * @apiParam {String}    name                                  Event name
 * @apiParam {String}    description                           Event full description
 * @apiParam {Object}    place                                 Venue (place object)
 * @apiParam {String}    place.name                            Venue name
 * @apiParam {String}    place.google_places_id                Venue place id
 * @apiParam {String}    place.address                         Venue address
 * @apiParam {String[]}  place.location                        Venue array location (lat, lng)
 * @apiParam {Object}    organizer                             Organizer full name
 * @apiSuccess {String}  numAffected                           1 for success 
 **/

router.put('/events/:event_id', middleware.isAuthenticated, middleware.isOrganizer, eventsController.edit);
router.delete('/events/:event_id', middleware.isAuthenticated, middleware.isOrganizer, eventsController.remove);

// ----Rides--------
/**
 * @api {put} /api/events/:event_id/add-ride Add event ride
 * @apiName AddEventRide
 * @apiGroup Rides 
 * @apiDescription Register a car for riding to and from the event
 * @apiParam seats
 * @apiParam {Date}    departure
 * @apiParam comment
 * @apiParam {Boolean} going
 * @apiParam {Boolean} returning
 * @apiSuccess numAffected
 **/
router.put('/events/:event_id/add-ride', middleware.isAuthenticated, eventsController.addRide);

/**
 * @api {delete} /api/events/:event_id/rides/:ride_id Delete event ride
 * @apiName DeleteEventRide
 * @apiGroup Rides 
 * @apiDescription Register a car for riding to and from the event
 * @apiParam ride_id
 * @apiSuccess numAffected
 **/
router.delete('/events/:event_id/rides/:ride_id', middleware.isAuthenticated, middleware.isDriver, ridesController.deleteRide);

/**
 * @api {put} /api/rides/:ride_id/join request a spot for a ride
 * @apiName JoinEventRide
 * @apiGroup Rides
 * @apiDescription Register to a ride to or from the event
 * @apiParam {String} user_id
 * @apiSuccess numAffected
 **/
router.put('/rides/:ride_id/join', middleware.isAuthenticated, ridesController.joinRide);

/**
 * @api {put} /api/rides/:ride_id/ride-request/:request_id/accept accept a ride request
 * @apiName AcceptEventRideRequest
 * @apiGroup Rides
 * @apiDescription Register to a ride to or from the event
 * @apiSuccess numAffected
 **/
router.put('/rides/:ride_id/ride-requests/:request_id/accept', middleware.isAuthenticated, middleware.isDriver, ridesController.acceptRideRequest);
router.put('/rides/:ride_id/add-passenger', middleware.isAuthenticated, middleware.isPassenger, ridesController.addPassenger);  

/**
 * @api api/rides/:ride_id/leave cancel spot on event ride
 * @apiName LeaveEventRide
 * @apiGroup Rides
 * @apiDescription Cancel your spot for a ride to or from an event
 * @apiSuccess numAffected
 **/
router.put('/rides/:ride_id/leave', middleware.isAuthenticated, middleware.isPassenger, ridesController.leaveRide);

  /**
  * @api {delete} /api/events/:event Delete an event
  * @apiName DeleteEvent
  * @apiGroup Events
  * @apiDescription Remove a given Event by ID
  */

// ----Locations --------
// router.get('/locations', locationController.list);
// router.get('/location/:id', locationController.show);
// router.post('/locations', locationController.create);
// router.put('/locations/:id', locationController.update);
// router.delete('/locations/:id', locationController.remove);

// ----Settings ------
// router.get('/settings', settingsController.show);
// router.post('/settings', settingsController.update);

// ----Users --------
/**
* @api {get} /api/users Users list
* @apiName GetUsers
* @apiGroup Users
*
* @apiSuccess {ObjectId}  id                     Mongo generated ID.
* @apiSuccess {String}    name                   User full name
* @apiSuccess {String}    provider               Provider name (google, facebook, etc)
* @apiSuccess {String}    provider_id            Provider unique id
* @apiSuccess {String}    photo                  User url photo
* @apiSuccess {String}    email                  User email adddres
* @apiSuccess {Date}      created_at             Document creation  date
*/
router.get('/users', middleware.isAuthenticated, userController.list);

/**
* @api {post} /api/chats/add Add message
* @apiName add
* @apiGroup Chats
* @apiDescription         Add a chat message to a car
* @apiParam {String}      rideid                 Car ride ID
* @apiParam {String}      message                Message content
* @apiParam {String}      user                   Full User names
* @apiSuccess {ObjectId}  id                     Mongo generated ID.
* @apiSuccess {String}    name                   Event name
* @apiSuccess {String}    description            Event full description
* @apiSuccess {String}    address                Full place address
*/
// router.post('/chats/add', chatController.addMessage);

/**
* @api {get} /api/chats/:rideid Get messages
* @apiName get
* @apiGroup Chats
* @apiDescription Get a chat log from a car
* @apiParam {String} rideid The Car ID.
*
* @apiExample Example usage:
* curl -i http://nscarpooling.herokuapp.com/api/chats/570fca7f1c9867110018ebc3
* @apiSuccess {Object[]}  messages               Avaiable cars array
* @apiSuccess {ObjectId}  messages.content       Car driver id
* @apiSuccess {String}    messages.username      Car driver name
* @apiSuccess {Date}      messages.created_at    Car avaiable seats for carpooling
* @apiSuccess {Date}      created_at             Event full description
* @apiSuccess {Date}      updated_at             Full place address
*/
// router.get('/chats/:rideid', chatController.getMessages);

// router.get('/fcm/registerUserToken', fcmController.registerUserToken);
// router.get('/fcm/send', fcmController.send);

module.exports = router;
