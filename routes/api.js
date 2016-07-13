var express = require('express');
var router = express.Router();
// var settingsController = require('../controllers/settingController.js');
var eventsController = require('../controllers/eventController.js');
// var locationController = require('../controllers/locationController.js');
var userController = require('../controllers/userController.js');
<<<<<<< HEAD
var ridesController = require('../controllers/rideController.js');
// var chatController = require('../controllers/chatController.js');
=======
var chatController = require('../controllers/chatController.js');
var fcmController = require('../controllers/fcmController.js');
>>>>>>> master

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
<<<<<<< HEAD
  * @apiSuccess {Object}   place                            Information about the venue
  * @apiSuccess {Object}   organizer                        Organizer full name
  * @apiSuccess {String}   category                         Event category
  * @apiSuccess {Date}     datetime                         Event date and time
  * @apiSuccess {String[]} tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} going_rides                      Rides going to the event
  * @apiSuccess {Object[]} returning_rides                  Rides going from the event
=======
  * @apiSuccess {String}   address                          Full place address
  * @apiSuccess {String}   place                            Event venue  name
  * @apiSuccess {String}   place_id                         Id from google place api (unique)
  * @apiSuccess {String}   organizer                        Organizer full name
  * @apiSuccess {ObjectId} organizer_id                     Organizer user ID
  * @apiSuccess {String}   category                         Event category
  * @apiSuccess {Date}     datetime                         Event date and time
  * @apiSuccess {String[]} tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} cars                             Avaiable cars array
  * @apiSuccess {ObjectId} cars.driver_id                   Car driver id
  * @apiSuccess {String}   cars.driver_name                 Car driver name
  * @apiSuccess {Number}   cars.seats                       Car avaiable seats for carpooling
  * @apiSuccess {String}   car.comments                     Car driver comments
  * @apiSuccess {Object[]} car.passenger                    Each car passenger
  * @apiSuccess {ObjectId} car.passenger.passenger_id       Passenger user id
  * @apiSuccess {String}   car.passenger.passenger_name     Passenger name
  * @apiSuccess {String}   car.passanger.passenger_photo    Passenger photo
  * @apiSuccess {String}   car.passanger.passenger_email    Passenger email address
  * @apiSuccess {Object[]} location                         Location: longitude and latitude.
>>>>>>> master
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
<<<<<<< HEAD
  * @apiSuccess {Object}   place                            Event venue  name
  * @apiSuccess {Object}   organizer                        Organizer full name
  * @apiSuccess {String}   category                         Event category
  * @apiSuccess {Date}     datetime                         Event date and time
  * @apiSuccess {String[]} tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} going_rides                      Rides going to the event
  * @apiSuccess {Object[]} returning_rides                  Rides going from the event
=======
  * @apiSuccess {String}   address                          Full place address
  * @apiSuccess {String}   place                            Event venue  name
  * @apiSuccess {String}   place_id                         Id from google place api (unique)
  * @apiSuccess {String}   organizer                        Organizer full name
  * @apiSuccess {ObjectId} organizer_id                     Organizer user ID
  * @apiSuccess {String}   category                         Event category
  * @apiSuccess {Date}     datetime                         Event date and time
  * @apiSuccess {String[]} tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} cars                             Avaiable cars array
  * @apiSuccess {ObjectId} cars.driver_id                   Car driver id
  * @apiSuccess {String}   cars.driver_name                 Car driver name
  * @apiSuccess {Number}   cars.seats                       Car avaiable seats for carpooling
  * @apiSuccess {String}   car.comments                     Car driver comments
  * @apiSuccess {Object[]} car.passenger                    Each car passenger
  * @apiSuccess {ObjectId} car.passenger.passenger_id       Passenger user id
  * @apiSuccess {String}   car.passenger.passenger_name     Passenger name
  * @apiSuccess {String}   car.passanger.passenger_photo    Passenger photo
  * @apiSuccess {String}   car.passanger.passenger_email    Passenger email address
  * @apiSuccess {Object[]} location                         Location: longitude and latitude.
>>>>>>> master
  * @apiSuccess {Date}     created_at                       Document creation  date
  * @apiSuccess {Date}     updated_at                       Last updated
  */
  router.get('/events/past', eventsController.past);

  /**
  * @api {post} events New event
  * @apiName CreateEvent 
  * @apiGroup Events
  * @apiParam {String}   name                     Event name
  * @apiParam {String}   description              Event full description
<<<<<<< HEAD
  * @apiParam {String}   [address]                Full place address 
  * @apiParam {Object}   location                 Location: longitude and latitude.
  * @apiParam {String}   place_name               Event venue name
  * @apiParam {String}   place_id                 Event venue reference 
  * @apiParam {String}   organizer                Organizer user ID
  * @apiParam {Date}     [datetime]               Event date and time
  * @apiParam {String[]} tags                     List of tags (Array of Strings)
  */
  router.post('/events', eventsController.create);          
  
  /**
  * @api {get} events/:id Show an event 
  * @apiName GetEvent 
=======
  * @apiParam {String}   [address]                Full place address
  * @apiParam {Object[]} [location]               Location: longitude and latitude.
  * @apiParam {String}   [place]                  Event venue name
  * @apiParam {String}   [organizer]              Organizer full name
  * @apiParam {ObjectId} [organizer_id]           Organizer user ID
  * @apiParam {String}   category                 Event category
  * @apiParam {Date}     [datetime]               Event date and time
  * @apiParam {String[]} tags                     List of tags (Array of Strings)
  */
  router.post('/events/new', eventsController.create);
  /**
  * @api {get} events/:id Show an event
  * @apiName show
>>>>>>> master
  * @apiGroup Events
  * @apiDescription Display an event details
  * @apiParam {String}    [id]                              Event id
  *
  * @apiSuccess {ObjectId} id                               Mongo generated ID.
  * @apiSuccess {String}   name                             Event name
  * @apiSuccess {String}   description                      Event full description
<<<<<<< HEAD
  * @apiSuccess {Object}   place                            Event venue  name
  * @apiSuccess {Object}   organizer                        Organizer full name
  * @apiSuccess {String}   category                         Event category
  * @apiSuccess {Date}     datetime                         Event date and time
  * @apiSuccess {String[]} tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} going_rides                      Rides going to the event
  * @apiSuccess {Object[]} returning_rides                  Rides going from the event
  * @apiSuccess {Date}     created_at                       Document creation  date
=======
  * @apiSuccess {String}   address                          Full place address
  * @apiSuccess {String}   place                            Event venue  name
  * @apiSuccess {String}   place_id                         Id from google place api (unique)
  * @apiSuccess {String}   organizer                        Organizer full name
  * @apiSuccess {ObjectId} organizer_id                     Organizer user ID
  * @apiSuccess {String}   category                         Event category
  * @apiSuccess {Date}     datetime                         Event date and time
  * @apiSuccess {String[]} tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} cars                             Avaiable cars array
  * @apiSuccess {ObjectId} cars.driver_id                   Car driver id
  * @apiSuccess {String}   cars.driver_name                 Car driver name
  * @apiSuccess {Number}   cars.seats                       Car avaiable seats for carpooling
  * @apiSuccess {String}   car.comments                     Car driver comments
  * @apiSuccess {Object[]} car.passenger                    Each car passenger
  * @apiSuccess {ObjectId} car.passenger.passenger_id       Passenger user id
  * @apiSuccess {String}   car.passenger.passenger_name     Passenger name
  * @apiSuccess {String}   car.passanger.passenger_photo    Passenger photo
  * @apiSuccess {String}   car.passanger.passenger_email    Passenger email address
  * @apiSuccess {Object[]} location                         Location: longitude and latitude.
>>>>>>> master
  * @apiSuccess {Date}     created_at                       Document creation  date
  * @apiSuccess {Date}     updated_at                       Last updated
  */
  router.get('/events/:id', eventsController.show);             //Show an event

  /**
<<<<<<< HEAD
  * @api {get} events/users/:user User events  
  * @apiName GetUserEvents
=======
  * @api {get} events/user/:user User events
  * @apiName User events
>>>>>>> master
  * @apiGroup Events
  * @apiDescription List all events from that user
  * @apiParam {String}     user                             User id
  *
  * @apiSuccess {ObjectId} id                               Mongo generated ID.
  * @apiSuccess {String}   name                             Event name
  * @apiSuccess {String}   description                      Event full description
<<<<<<< HEAD
  * @apiSuccess {Object}   place                            Event venue  name
  * @apiSuccess {Object}   organizer                        Organizer full name
  * @apiSuccess {String}   category                         Event category
  * @apiSuccess {Date}     datetime                         Event date and time
  * @apiSuccess {String[]} tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} going_rides                      Rides going to the event
  * @apiSuccess {Object[]} returning_rides                  Rides going from the event
=======
  * @apiSuccess {String}   address                          Full place address
  * @apiSuccess {String}   place                            Event venue  name
  * @apiSuccess {String}   place_id                         Id from google place api (unique)
  * @apiSuccess {String}   organizer                        Organizer full name
  * @apiSuccess {ObjectId} organizer_id                     Organizer user ID
  * @apiSuccess {String}   category                         Event category
  * @apiSuccess {Date}     datetime                         Event date and time
  * @apiSuccess {String[]} tags                             List of tags (Array of Strings)
  * @apiSuccess {Object[]} cars                             Avaiable cars array
  * @apiSuccess {ObjectId} cars.driver_id                   Car driver id
  * @apiSuccess {String}   cars.driver_name                 Car driver name
  * @apiSuccess {Number}   cars.seats                       Car avaiable seats for carpooling
  * @apiSuccess {String}   car.comments                     Car driver comments
  * @apiSuccess {Object[]} car.passenger                    Each car passenger
  * @apiSuccess {ObjectId} car.passenger.passenger_id       Passenger user id
  * @apiSuccess {String}   car.passenger.passenger_name     Passenger name
  * @apiSuccess {String}   car.passanger.passenger_photo    Passenger photo
  * @apiSuccess {String}   car.passanger.passenger_email    Passenger email address
  * @apiSuccess {Object[]} location                         Location: longitude and latitude.
>>>>>>> master
  * @apiSuccess {Date}     created_at                       Document creation  date
  * @apiSuccess {Date}     created_at                       Document creation  date
  * @apiSuccess {Date}     updated_at                       Last updated  
  */
<<<<<<< HEAD

router.get('/users/:user/events', eventsController.user);    // List  by user
  
  
//router.post('/events/carbyuser', eventsController.carbyuser); // Carpooling by user[no longer used]


//router.put('/events/signup/:id', eventsController.signup);    // Event sign up [no longer used]

/**
 * @api {put} events/:event/ Edit event
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

router.put('/events/:event', eventsController.edit); 

/**
 * @api {put} events/:event/add-ride event ride
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
router.put('/events/:event/add-ride', eventsController.addCar);       //Add a car

router.put('/events/:event/delete-ride', eventsController.deleteCar); //Delete a car
router.put('/events/:event/car-by-user', eventsController.carbyuser); //Car polling by user
router.delete('/events/:event', eventsController.remove);        //Delete an event

/**
 * @api {put} rides/:ride/join request a spot for a ride
 * @apiName JoinEventRide
 * @apiGroup Rides 
 * @apiDescription Register to a ride to or from the event
 * @apiParam {String} userId 
 * @apiSuccess numAffected
 **/
router.put('/rides/:ride/join', ridesController.joinRide);     //Join a car

/**
 * @api {put} ride-request/:request/accept accept a ride request
 * @apiName AcceptEventRideRequest
 * @apiGroup Rides 
 * @apiDescription Register to a ride to or from the event
 * @apiSuccess numAffected
 **/
router.put('/ride-requests/:request/accept', ridesController.acceptRideRequest);
router.put('/rides/:ride/add-passenger', ridesController.addExtra);   //Add extra passanger

/**
 * @api {put} rides/:ride/leave cancel spot on event ride
 * @apiName LeaveEventRide
 * @apiGroup Rides 
 * @apiDescription Cancel your spot for a ride to or from an event
 * @apiParam {String} userId 
 * @apiSuccess numAffected
 **/
router.put('/rides/:ride/leave', ridesController.leaveRide);   //Leave a car

  /**
  * @api {delete} events/:event delete an event 
  * @apiName DeleteEvent
  * @apiGroup Events
  * @apiDescription Remove a given Event by ID 
  */
=======
  router.get('/events/user/:user', eventsController.user);    // List  by user
router.put('/events/signup/:id', eventsController.signup);    // Event sign up [no longer used]
router.put('/events/:id', eventsController.update);           //Update an event

  /**
  * @api {post} events/:event/car Add car
  * @apiName Addcar
  * @apiGroup Cars
  * @apiDescription add a new car to the event
  * @apiParam {String}     event                            Event id
  * @apiParam {String}     driver_id                        Driver id
  *
  * @apiSuccess {ObjectId} id                               Mongo generated ID.
  * @apiSuccess {Date}     created_at                       Document creation  date
  */
  router.post('/events/:event/car', eventsController.addCar);       //Add a car

  /**
  * @api {post} events/car Add car
  * @apiName Addcar
  * @apiGroup Cars
  * @apiDescription add a new car to the event
  * @apiParam {String}     event                            Event id
  * @apiParam {String}     user                             User id
  *
  * @apiSuccess {ObjectId} id                               Mongo generated ID.
  * @apiSuccess {Date}     created_at                       Document creation  date
  */
router.delete('/events/deletecar', eventsController.deleteCar); //Delete a car


router.post('/events/joincar', eventsController.joinCar);     //Join a car
router.post('/events/addExtra', eventsController.addExtra);   //Add extra passanger
router.post('/events/leavecar', eventsController.leaveCar);   //Leave a car
router.post('/events/carbyuser', eventsController.carbyuser); //Car polling by user
router.delete('/events/:id', eventsController.remove);        //Delete an event
router.post('/events/:id/car/:carId/message', eventsController.messageDriver);
>>>>>>> master

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


router.get('/fcm/registerUserToken', fcmController.registerUserToken);
router.get('/fcm/send', fcmController.send);


module.exports = router;
