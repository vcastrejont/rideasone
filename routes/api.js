var express = require('express');
var router = express.Router();
// var settingsController = require('../controllers/settingController.js');
var eventsController = require('../controllers/eventController.js');
// var locationController = require('../controllers/locationController.js');
var userController = require('../controllers/userController.js');
var ridesController = require('../controllers/rideController.js');
// var chatController = require('../controllers/chatController.js');

router.get('/', function(req, res) {
 res.send('API list');
});

// ----Events --------
  /**
  * @api {get} /api/events All future events
  * @apiName GetFutureEvents 
  * @apiGroup Events
  * @apiDescription Returns an array of all events with date greater than yesterday.
  *
  * @apiSuccess {ObjectId} /api/id                               Mongo generated ID.
  * @apiSuccess {String} /api/  name                             Event name
  * @apiSuccess {String} /api/  description                      Event full description
  * @apiSuccess {Object} /api/  place                            Information about the venue
  * @apiSuccess {Object} /api/  organizer                        Organizer full name
  * @apiSuccess {String} /api/  category                         Event category
  * @apiSuccess {Date} /api/    datetime                         Event date and time
  * @apiSuccess {String[]} /api/tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} /api/going_rides                      Rides going to the event
  * @apiSuccess {Object[]} /api/returning_rides                  Rides going from the event
  * @apiSuccess {Date} /api/    created_at                       Document creation  date
  * @apiSuccess {Date} /api/    updated_at                       Last updated
  */
  router.get('/events', eventsController.list);

  /**
  * @api {get} /api/events/past Past events
  * @apiName GetPastEvents 
  * @apiGroup Events
  *
  * @apiSuccess {ObjectId} /api/id                               Mongo generated ID.
  * @apiSuccess {String} /api/  name                             Event name
  * @apiSuccess {String} /api/  description                      Event full description
  * @apiSuccess {Object} /api/  place                            Event venue  name
  * @apiSuccess {Object} /api/  organizer                        Organizer full name
  * @apiSuccess {String} /api/  category                         Event category
  * @apiSuccess {Date} /api/    datetime                         Event date and time
  * @apiSuccess {String[]} /api/tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} /api/going_rides                      Rides going to the event
  * @apiSuccess {Object[]} /api/returning_rides                  Rides going from the event
  * @apiSuccess {Date} /api/    created_at                       Document creation  date
  * @apiSuccess {Date} /api/    updated_at                       Last updated
  */
  router.get('/events/past', eventsController.past);

  /**
  * @api {post} /api/events New event
  * @apiName CreateEvent 
  * @apiGroup Events
  * @apiParam {String} /api/  name                     Event name
  * @apiParam {String} /api/  description              Event full description
  * @apiParam {String} /api/  [address]                Full place address 
  * @apiParam {Object} /api/  location                 Location: longitude and latitude.
  * @apiParam {String} /api/  place_name               Event venue name
  * @apiParam {String} /api/  place_id                 Event venue reference 
  * @apiParam {String} /api/  organizer                Organizer user ID
  * @apiParam {Date} /api/    [datetime]               Event date and time
  * @apiParam {String[]} /api/tags                     List of tags (Array of Strings)
  */
  router.post('/events', eventsController.create);          
  
  /**
  * @api {get} /api/events/:id Show an event 
  * @apiName GetEvent 
  * @apiGroup Events
  * @apiDescription Display an event details
  * @apiParam {String} /api/   [id]                              Event id
  *
  * @apiSuccess {ObjectId} /api/id                               Mongo generated ID.
  * @apiSuccess {String} /api/  name                             Event name
  * @apiSuccess {String} /api/  description                      Event full description
  * @apiSuccess {Object} /api/  place                            Event venue  name
  * @apiSuccess {Object} /api/  organizer                        Organizer full name
  * @apiSuccess {String} /api/  category                         Event category
  * @apiSuccess {Date} /api/    datetime                         Event date and time
  * @apiSuccess {String[]} /api/tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} /api/going_rides                      Rides going to the event
  * @apiSuccess {Object[]} /api/returning_rides                  Rides going from the event
  * @apiSuccess {Date} /api/    created_at                       Document creation  date
  * @apiSuccess {Date} /api/    created_at                       Document creation  date
  * @apiSuccess {Date} /api/    updated_at                       Last updated
  */
  router.get('/events/:id', eventsController.show);             //Show an event

  /**
  * @api {get} /api/events/users/:user User events  
  * @apiName GetUserEvents
  * @apiGroup Events
  * @apiDescription List all events from that user
  * @apiParam {String} /api/    user                             User id
  *
  * @apiSuccess {ObjectId} /api/id                               Mongo generated ID.
  * @apiSuccess {String} /api/  name                             Event name
  * @apiSuccess {String} /api/  description                      Event full description
  * @apiSuccess {Object} /api/  place                            Event venue  name
  * @apiSuccess {Object} /api/  organizer                        Organizer full name
  * @apiSuccess {String} /api/  category                         Event category
  * @apiSuccess {Date} /api/    datetime                         Event date and time
  * @apiSuccess {String[]} /api/tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} /api/going_rides                      Rides going to the event
  * @apiSuccess {Object[]} /api/returning_rides                  Rides going from the event
  * @apiSuccess {Date} /api/    created_at                       Document creation  date
  * @apiSuccess {Date} /api/    created_at                       Document creation  date
  * @apiSuccess {Date} /api/    updated_at                       Last updated  
  */
router.get('/users/:user/events', eventsController.user);    // List  by user
  
  
//router.post('/events/carbyuser', eventsController.carbyuser); // Carpooling by user[no longer used]


//router.put('/events/signup/:id', eventsController.signup);    // Event sign up [no longer used]

/**
 * @api {put} /api/events/:event/ Edit event
 * @apiName EditEvent
 * @apiGroup Events
 * @apiDescription Edit an event
 * @apiParam name
 * @apiParam place
 * @apiParam datetime
 * @apiParam description
 * @apiParam {Boolean} /api/returning
 * @apiSuccess numAffected
 **/

router.put('/events/:event', eventsController.edit); 

/**
 * @api {put} /api/events/:event/add-ride event ride
 * @apiName AddEventRide
 * @apiGroup Events
 * @apiDescription Register a car for riding to and from the event
 * @apiParam driverId
 * @apiParam seats
 * @apiParam comment
 * @apiParam {Boolean} /api/going
 * @apiParam {Boolean} /api/returning
 * @apiSuccess numAffected
 **/
router.put('/events/:event/add-ride', eventsController.addCar);       //Add a car

router.put('/events/:event/delete-ride', eventsController.deleteCar); //Delete a car
router.put('/events/:event/car-by-user', eventsController.carbyuser); //Car polling by user
router.delete('/events/:event', eventsController.remove);        //Delete an event

/**
 * @api {put} /api/rides/:ride/join request a spot for a ride
 * @apiName JoinEventRide
 * @apiGroup Rides 
 * @apiDescription Register to a ride to or from the event
 * @apiParam {String} /api/userId 
 * @apiSuccess numAffected
 **/
router.put('/rides/:ride/join', ridesController.joinRide);     //Join a car

/**
 * @api {put} /api/ride-request/:request/accept accept a ride request
 * @apiName AcceptEventRideRequest
 * @apiGroup Rides 
 * @apiDescription Register to a ride to or from the event
 * @apiSuccess numAffected
 **/
router.put('/ride-requests/:request/accept', ridesController.acceptRideRequest);
router.put('/rides/:ride/add-passenger', ridesController.addExtra);   //Add extra passanger

/**
 * @api api/rides/:ride/leave cancel spot on event ride
 * @apiName LeaveEventRide
 * @apiGroup Rides 
 * @apiDescription Cancel your spot for a ride to or from an event
 * @apiParam {String} /api/userId 
 * @apiSuccess numAffected
 **/
router.put('/rides/:ride/leave', ridesController.leaveRide);   //Leave a car

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
* @apiSuccess {ObjectId} /api/id                     Mongo generated ID.
* @apiSuccess {String} /api/  name                   User full name
* @apiSuccess {String} /api/  provider               Provider name (google, facebook, etc)
* @apiSuccess {String} /api/  provider_id            Provider unique id
* @apiSuccess {String} /api/  photo                  User url photo
* @apiSuccess {String} /api/  email                  User email adddres
* @apiSuccess {Date} /api/    created_at             Document creation  date
*/
router.get('/users', userController.list);

/**
* @api {post} /api/users Create user
* @apiName CreateUser
* @apiGroup Users
* @apiParam {String} /api/    provider_id            Provider unique id
* @apiParam {String} /api/    name                   User full name
* @apiParam {String} /api/    provider               Provider name (google, facebook, etc)
* @apiParam {String} /api/    [photo]                User url photo
* @apiParam {String} /api/    email                  User email adddres

*
* @apiSuccess {ObjectId} /api/id                     Mongo generated ID.
* @apiSuccess {String} /api/  name                   User full name
* @apiSuccess {String} /api/  provider               Provider name (google, facebook, etc)
* @apiSuccess {String} /api/  provider_id            Provider unique id
* @apiSuccess {String} /api/  photo                  User url photo
* @apiSuccess {String} /api/  email                  User email adddres
* @apiSuccess {Date} /api/    created_at             Document creation  date
*/
router.post('/users', userController.create);


/**
* @api {post} /api/chats/add Add message
* @apiName add
* @apiGroup Chats
* @apiDescription Add a chat message to a car
* @apiParam {String} /api/    rideid                 Car ride ID
* @apiParam {String} /api/    message                Message content
* @apiParam {String} /api/    user                   Full User names
* @apiSuccess {ObjectId} /api/id                     Mongo generated ID.
* @apiSuccess {String} /api/  name                   Event name
* @apiSuccess {String} /api/  description            Event full description
* @apiSuccess {String} /api/  address                Full place address
*/
// router.post('/chats/add', chatController.addMessage);


/**
* @api {get} /api/chats/:rideid Get messages
* @apiName get
* @apiGroup Chats
* @apiDescription Get a chat log from a car
* @apiParam {String} /api/rideid The Car ID.
*
* @apiExample Example usage:
* curl -i http://nscarpooling.herokuapp.com/api/chats/570fca7f1c9867110018ebc3
* @apiSuccess {Object[]} /api/messages               Avaiable cars array
* @apiSuccess {ObjectId} /api/messages.content       Car driver id
* @apiSuccess {String} /api/  messages.username      Car driver name
* @apiSuccess {Date} /api/    messages.created_at    Car avaiable seats for carpooling
* @apiSuccess {Date} /api/    created_at             Event full description
* @apiSuccess {Date} /api/    updated_at             Full place address
*/
// router.get('/chats/:rideid', chatController.getMessages);

// router.get('/fcm/registerUserToken', fcmController.registerUserToken);
// router.get('/fcm/send', fcmController.send);

module.exports = router;
