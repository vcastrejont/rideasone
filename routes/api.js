var express = require('express');
var router = express.Router();
// var settingsController = require('../controllers/settingController.js');
var eventsController = require('../controllers/eventController.js');
// var locationController = require('../controllers/locationController.js');
var userController = require('../controllers/userController.js');
// var chatController = require('../controllers/chatController.js');

router.get('/', function(req, res) {
 res.send('API list');
});

// ----Events --------
  /**
  * @api {get} events All future events
  * @apiName GetFutureEvents 
  * @apiGroup Events
  * @apiDescription Returns an array of all events with date greater than yesterday.
  *
  * @apiSuccess {ObjectId} id                               Mongo generated ID.
  * @apiSuccess {String}   name                             Event name
  * @apiSuccess {String}   description                      Event full description
  * @apiSuccess {Object}   place                            Information about the venue
  * @apiSuccess {Object}   organizer                        Organizer full name
  * @apiSuccess {String}   category                         Event category
  * @apiSuccess {Date}     datetime                         Event date and time
  * @apiSuccess {String[]} tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} going_rides                      Rides going to the event
  * @apiSuccess {Object[]} returning_rides                  Rides going from the event
  * @apiSuccess {Date}     created_at                       Document creation  date
  * @apiSuccess {Date}     updated_at                       Last updated
  */
  router.get('/events', eventsController.list);         
  
  /**
  * @api {get} events/past Past events
  * @apiName GetPastEvents 
  * @apiGroup Events
  *
  * @apiSuccess {ObjectId} id                               Mongo generated ID.
  * @apiSuccess {String}   name                             Event name
  * @apiSuccess {String}   description                      Event full description
  * @apiSuccess {Object}   place                            Event venue  name
  * @apiSuccess {Object}   organizer                        Organizer full name
  * @apiSuccess {String}   category                         Event category
  * @apiSuccess {Date}     datetime                         Event date and time
  * @apiSuccess {String[]} tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} going_rides                      Rides going to the event
  * @apiSuccess {Object[]} returning_rides                  Rides going from the event
  * @apiSuccess {Date}     created_at                       Document creation  date
  * @apiSuccess {Date}     updated_at                       Last updated
  */
  router.get('/events/past', eventsController.past);  

  /**
  * @api {post} events New event
  * @apiName CreateEvent 
  * @apiGroup Events
  * @apiParam {String}   [name]                   Event name
  * @apiParam {String}   description              Event full description
  * @apiParam {String}   [address]                Full place address 
  * @apiParam {Object[]} [location]               Location: longitude and latitude.
  * @apiParam {String}   [place]                  Event venue name
  * @apiParam {String}   [organizer]              Organizer full name
  * @apiParam {ObjectId} [organizer_id]           Organizer user ID
  * @apiParam {String}   category                 Event category
  * @apiParam {Date}     [datetime]               Event date and time
  * @apiParam {String[]} tags                     List of tags (Array of Strings)
  */
  router.post('/events', eventsController.create);          
  
  /**
  * @api {get} events/:id Show an event 
  * @apiName GetEvent 
  * @apiGroup Events
  * @apiDescription Display an event details
  * @apiParam {String}    [id]                              Event id
  *
  * @apiSuccess {ObjectId} id                               Mongo generated ID.
  * @apiSuccess {String}   name                             Event name
  * @apiSuccess {String}   description                      Event full description
  * @apiSuccess {Object}   place                            Event venue  name
  * @apiSuccess {Object}   organizer                        Organizer full name
  * @apiSuccess {String}   category                         Event category
  * @apiSuccess {Date}     datetime                         Event date and time
  * @apiSuccess {String[]} tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} going_rides                      Rides going to the event
  * @apiSuccess {Object[]} returning_rides                  Rides going from the event
  * @apiSuccess {Date}     created_at                       Document creation  date
  * @apiSuccess {Date}     created_at                       Document creation  date
  * @apiSuccess {Date}     updated_at                       Last updated
  */
  router.get('/events/:id', eventsController.show);             //Show an event

  /**
  * @api {get} events/users/:user User events  
  * @apiName GetUserEvents
  * @apiGroup Events
  * @apiDescription List all events from that user
  * @apiParam {String}     user                             User id
  *
  * @apiSuccess {ObjectId} id                               Mongo generated ID.
  * @apiSuccess {String}   name                             Event name
  * @apiSuccess {String}   description                      Event full description
  * @apiSuccess {Object}   place                            Event venue  name
  * @apiSuccess {Object}   organizer                        Organizer full name
  * @apiSuccess {String}   category                         Event category
  * @apiSuccess {Date}     datetime                         Event date and time
  * @apiSuccess {String[]} tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} going_rides                      Rides going to the event
  * @apiSuccess {Object[]} returning_rides                  Rides going from the event
  * @apiSuccess {Date}     created_at                       Document creation  date
  * @apiSuccess {Date}     created_at                       Document creation  date
  * @apiSuccess {Date}     updated_at                       Last updated  
  */

  router.get('/users/:user/events', eventsController.user);    // List  by user
  
  
//router.post('/events/carbyuser', eventsController.carbyuser); // Carpooling by user[no longer used]


//router.put('/events/signup/:id', eventsController.signup);    // Event sign up [no longer used]
router.put('/events/:event', eventsController.update);           //Update an event

/**
 * @api {put} events/:event/add-car add event ride
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
router.put('/events/:event/add-car', eventsController.addCar);       //Add a car
router.put('/events/:event/delete-car', eventsController.deleteCar); //Delete a car
router.put('/events/:event/join-car', eventsController.joinCar);     //Join a car
router.put('/events/:event/add-passenger', eventsController.addExtra);   //Add extra passanger
router.put('/events/:event/leave-car', eventsController.leaveCar);   //Leave a car
router.put('/events/:event/car-by-user', eventsController.carbyuser); //Car polling by user

  /**
  * @api {delete} events/:event delete an event 
  * @apiName DeleteEvent
  * @apiGroup Events
  * @apiDescription Remove a given Event by ID 
  */

router.delete('/events/:event', eventsController.remove);        //Delete an event

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
* @api {get} users Users list
* @apiName GetUsers
* @apiGroup Users
*
* @apiSuccess {ObjectId} id                     Mongo generated ID.
* @apiSuccess {String}   name                   User full name
* @apiSuccess {String}   provider               Provider name (google, facebook, etc)
* @apiSuccess {String}   provider_id            Provider unique id
* @apiSuccess {String}   photo                  User url photo 
* @apiSuccess {String}   email                  User email adddres 
* @apiSuccess {Date}     created_at             Document creation  date
*/
  router.get('/users', userController.list);

/**
* @api {post} users Create user
* @apiName CreateUser
* @apiGroup Users
* @apiParam {String}     provider_id            Provider unique id 
* @apiParam {String}     name                   User full name
* @apiParam {String}     provider               Provider name (google, facebook, etc)
* @apiParam {String}     [photo]                User url photo 
* @apiParam {String}     email                  User email adddres 

*
* @apiSuccess {ObjectId} id                     Mongo generated ID.
* @apiSuccess {String}   name                   User full name
* @apiSuccess {String}   provider               Provider name (google, facebook, etc)
* @apiSuccess {String}   provider_id            Provider unique id
* @apiSuccess {String}   photo                  User url photo 
* @apiSuccess {String}   email                  User email adddres 
* @apiSuccess {Date}     created_at             Document creation  date
*/
router.post('/users', userController.create);


/**
* @api {post} chats/add Add message
* @apiName add
* @apiGroup Chats
* @apiDescription Add a chat message to a car 
* @apiParam {String}     rideid                 Car ride ID
* @apiParam {String}     message                Message content
* @apiParam {String}     user                   Full User names
* @apiSuccess {ObjectId} id                     Mongo generated ID.
* @apiSuccess {String}   name                   Event name
* @apiSuccess {String}   description            Event full description
* @apiSuccess {String}   address                Full place address 
*/
// router.post('/chats/add', chatController.addMessage);


/**
* @api {get} chats/:rideid Get messages
* @apiName get
* @apiGroup Chats
* @apiDescription Get a chat log from a car 
* @apiParam {String} rideid The Car ID.
*
* @apiExample Example usage:
* curl -i http://nscarpooling.herokuapp.com/api/chats/570fca7f1c9867110018ebc3
* @apiSuccess {Object[]} messages               Avaiable cars array
* @apiSuccess {ObjectId} messages.content       Car driver id
* @apiSuccess {String}   messages.username      Car driver name
* @apiSuccess {Date}     messages.created_at    Car avaiable seats for carpooling
* @apiSuccess {Date}     created_at             Event full description
* @apiSuccess {Date}     updated_at             Full place address 
*/
// router.get('/chats/:rideid', chatController.getMessages);


module.exports = router;
