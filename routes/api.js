var express = require('express');
var router = express.Router();
// var settingsController = require('../controllers/settingController.js');
var eventsController = require('../controllers/eventController.js');
// var locationController = require('../controllers/locationController.js');
var userController = require('../controllers/userController.js');
var ridesController = require('../controllers/rideController.js');
// var chatController = require('../controllers/chatController.js');

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
  * @apiSuccess {ObjectId}  id                      Mongo generated ID.
  * @apiSuccess {String}    name                    Event name
  * @apiSuccess {String}    description             Event full description
  * @apiSuccess {Object}    place                   Information about the venue
  * @apiSuccess {Object}    organizer               Organizer full name
  * @apiSuccess {String}    category                Event category
  * @apiSuccess {Date}      datetime                Event date and time
  * @apiSuccess {String[]}  tags                    List of tags (Array of Strings)
  * @apiSuccess {Object[]}  going_rides             Rides going to the event
  * @apiSuccess {Object[]}  returning_rides         Rides going from the event
  * @apiSuccess {Date}      created_at              Document creation  date
  * @apiSuccess {Date}      updated_at              Last updated
  */
router.get('/events', middleware.isAuthenticated, eventsController.list);

  /**
  * @api {get} /api/events/past Past events
  * @apiName GetPastEvents
  * @apiGroup Events
  *
  * @apiSuccess {ObjectId}  id                  Mongo generated ID.
  * @apiSuccess {String}    name                Event name
  * @apiSuccess {String}    description         Event full description
  * @apiSuccess {Object}    place               Event venue  name
  * @apiSuccess {Object}    organizer           Organizer full name
  * @apiSuccess {String}    category            Event category
  * @apiSuccess {Date}      datetime            Event date and time
  * @apiSuccess {String[]}  tags                List of tags (Array of Strings)
  * @apiSuccess {Object[]}  going_rides         Rides going to the event
  * @apiSuccess {Object[]}  returning_rides     Rides going from the event
  * @apiSuccess {Date}      created_at          Document creation  date
  * @apiSuccess {Date}      updated_at          Last updated
  */
router.get('/events/past', middleware.isAuthenticated, eventsController.past);

  /**
  * @api {post} /api/events New event
  * @apiName CreateEvent
  * @apiGroup Events
  * @apiParam {String}    name                     Event name
  * @apiParam {String}    description              Event full description
  * @apiParam {String}    [address]                Full place address
  * @apiParam {Object}    location                 Location: longitude and latitude.
  * @apiParam {String}    place_name               Event venue name
  * @apiParam {String}    place_id                 Event venue reference
  * @apiParam {Date}      [datetime]               Event date and time
  * @apiParam {String[]}  tags                     List of tags (Array of Strings)
  */
router.post('/events', middleware.isAuthenticated, eventsController.create);

  /**
  * @api {get} /api/events/:id Show an event
  * @apiName GetEvent
  * @apiGroup Events
  * @apiDescription Display an event details
  * @apiParam {String}  [id]                              Event id
  *
  * @apiSuccess {ObjectId}  id                            Mongo generated ID.
  * @apiSuccess {String}    name                          Event name
  * @apiSuccess {String}    description                   Event full description
  * @apiSuccess {Object}    place                         Event venue  name
  * @apiSuccess {Object}    organizer                     Organizer full name
  * @apiSuccess {String}    category                      Event category
  * @apiSuccess {Date}      datetime                      Event date and time
  * @apiSuccess {String[]}  tags                          List of tags (Array of Strings)
  * @apiSuccess {Object[]}  going_rides                   Rides going to the event
  * @apiSuccess {Object[]}  returning_rides               Rides going from the event
  * @apiSuccess {Date}      created_at                    Document creation  date
  * @apiSuccess {Date}      created_at                    Document creation  date
  * @apiSuccess {Date}      updated_at                    Last updated
  */
router.get('/events/:id', middleware.isAuthenticated, eventsController.show);             // Show an event

  /**
  * @api {get} /api/events/users/:user User events
  * @apiName GetUserEvents
  * @apiGroup Events
  * @apiDescription List all events from that user
  * @apiParam {String}   user                             User id
  *
  * @apiSuccess {ObjectId}  id                            Mongo generated ID.
  * @apiSuccess {String}    name                          Event name
  * @apiSuccess {String}    description                   Event full description
  * @apiSuccess {Object}    place                         Event venue  name
  * @apiSuccess {Object}    organizer                     Organizer full name
  * @apiSuccess {String}    category                      Event category
  * @apiSuccess {Date}      datetime                      Event date and time
  * @apiSuccess {String[]}  tags                          List of tags (Array of Strings)
  * @apiSuccess {Object[]}  going_rides                   Rides going to the event
  * @apiSuccess {Object[]}  returning_rides               Rides going from the event
  * @apiSuccess {Date}      created_at                    Document creation  date
  * @apiSuccess {Date}      created_at                    Document creation  date
  * @apiSuccess {Date}      updated_at                    Last updated
  */
router.get('/users/:user/events', middleware.isAuthenticated, eventsController.user);    // List  by user

// router.post('/events/carbyuser', eventsController.carbyuser); // Carpooling by user[no longer used]

// router.put('/events/signup/:id', eventsController.signup);    // Event sign up [no longer used]

/**
 * @api {put} /api/events/:event_id/ Edit event
 * @apiName EditEvent
 * @apiGroup Events
 * @apiDescription Edit an event
 * @apiParam name
 * @apiParam place
 * @apiParam datetime
 * @apiParam description
 * @apiParam {Boolean} returning
 * @apiSuccess numAffected
 **/

router.put('/events/:event', middleware.isAuthenticated, eventsController.edit);

/**
 * @api {put} /api/events/:event_id/add-ride event ride
 * @apiName AddEventRide
 * @apiGroup Events
 * @apiDescription Register a car for riding to and from the event
 * @apiParam driverId
 * @apiParam seats
 * @apiParam comment
 * @apiParam {Boolean} going
 * @apiParam {Boolean} returning
 * @apiSuccess numAffected
 **/
router.put('/events/:event_id/add-ride', middleware.isAuthenticated, eventsController.addCar);       // Add a car

router.put('/events/:event_id/delete-ride', middleware.isAuthenticated, eventsController.deleteCar); // Delete a car
router.put('/events/:event_id/car-by-user', middleware.isAuthenticated, eventsController.carbyuser); // Car polling by user
router.delete('/events/:event_id', middleware.isAuthenticated, middleware.isOrganizer, eventsController.remove);        // Delete an event

/**
 * @api {put} /api/rides/:ride_id/join request a spot for a ride
 * @apiName JoinEventRide
 * @apiGroup Rides
 * @apiDescription Register to a ride to or from the event
 * @apiParam {String} userId
 * @apiSuccess numAffected
 **/
router.put('/rides/:ride_id/join', middleware.isAuthenticated, ridesController.joinRide);     // Join a car

/**
 * @api {put} /api/ride-request/:request/accept accept a ride request
 * @apiName AcceptEventRideRequest
 * @apiGroup Rides
 * @apiDescription Register to a ride to or from the event
 * @apiSuccess numAffected
 **/
router.put('/ride-requests/:request/accept', middleware.isAuthenticated, ridesController.acceptRideRequest);
router.put('/rides/:ride_id/add-passenger', middleware.isAuthenticated, ridesController.addExtra);   // Add extra passanger

/**
 * @api api/rides/:ride_id/leave cancel spot on event ride
 * @apiName LeaveEventRide
 * @apiGroup Rides
 * @apiDescription Cancel your spot for a ride to or from an event
 * @apiParam {String} userId
 * @apiSuccess numAffected
 **/
router.put('/rides/:ride_id/leave', middleware.isAuthenticated, middleware.isPassenger, ridesController.leaveRide);   // Leave a car

  /**
  * @api {delete} /api/events/:event delete an event
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
* @api {post} /api/users Create user
* @apiName CreateUser
* @apiGroup Users
* @apiParam {String}   provider_id            Provider unique id
* @apiParam {String}   name                   User full name
* @apiParam {String}   provider               Provider name (google, facebook, etc)
* @apiParam {String}   [photo]                User url photo
* @apiParam {String}   email                  User email adddres

*
* @apiSuccess {ObjectId}  id                   Mongo generated ID.
* @apiSuccess {String}    name                 User full name
* @apiSuccess {String}    provider             Provider name (google, facebook, etc)
* @apiSuccess {String}    provider_id          Provider unique id
* @apiSuccess {String}    photo                User url photo
* @apiSuccess {String}    email                User email adddres
* @apiSuccess {Date}      created_at           Document creation  date
*/
router.post('/users', userController.create);

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
