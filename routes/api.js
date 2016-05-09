var express = require('express');
var router = express.Router();
var settingsController = require('../controllers/settingController.js');
var eventsController = require('../controllers/eventController.js');
var locationController = require('../controllers/locationController.js');
var userController = require('../controllers/userController.js');
var chatController = require('../controllers/chatController.js');

router.get('/', function(req, res) {
 res.send('API list');
});

// ----Events --------
  /**
  * @api {get} events All future events
  * @apiName list
  * @apiGroup Events
  * @apiDescription Display all users events with date greater than yesterday.
  *
  * @apiSuccess {ObjectId} id                     Mongo generated ID.
  * @apiSuccess {String}   name                   Event name
  * @apiSuccess {String}   description            Event full description
  * @apiSuccess {String}   address                Full place address 
  * @apiSuccess {String}   place                  Event venue  name
  * @apiSuccess {String}   place_id               Id from google place api (unique)
  * @apiSuccess {String}   organizer              Organizer full name
  * @apiSuccess {ObjectId} organizer_id           Organizer user ID
  * @apiSuccess {String}   category               Event category
  * @apiSuccess {Date}     datetime               Event date and time
  * @apiSuccess {String[]} tags                   List of tags (Array of Strings)
  * @apiSuccess {Object[]} cars                   Avaiable cars array
  * @apiSuccess {ObjectId} cars.driver_id         Car driver id
  * @apiSuccess {String}   cars.driver            Car driver name
  * @apiSuccess {Number}   cars.seats             Car avaiable seats for carpooling
  * @apiSuccess {String}   car.comments           Car driver comments
  * @apiSuccess {Object[]} car.passanger          Each car passenger (there is a typo error)
  * @apiSuccess {ObjectId} car.passanger.user_id  Passenger user id  
  * @apiSuccess {String}   car.passanger.name     Passenger name
  * @apiSuccess {String}   car.passanger.photo    Passenger photo
  * @apiSuccess {Object[]} location               Location: longitude and latitude.
  * @apiSuccess {Date}     created_at             Document creation  date
  * @apiSuccess {Date}     updated_at             Last updated
  */
  router.get('/events', eventsController.list);         
  
  /**
  * @api {get} events/past Past events
  * @apiName past
  * @apiGroup Events
  *
  * @apiSuccess {ObjectId} id                     Mongo generated ID.
  * @apiSuccess {String}   name                   Event name
  * @apiSuccess {String}   description            Event full description
  * @apiSuccess {String}   address                Full place address 
  * @apiSuccess {String}   place                  Event venue name
  * @apiSuccess {String}   place_id               Id from google place api (unique)
  * @apiSuccess {String}   organizer              Organizer full name
  * @apiSuccess {ObjectId} organizer_id           Organizer user ID
  * @apiSuccess {String}   category               Event category
  * @apiSuccess {Date}     datetime               Event date and time
  * @apiSuccess {String[]} tags                   List of tags (Array of Strings)
  * @apiSuccess {Object[]} cars                   Avaiable cars array
  * @apiSuccess {ObjectId} cars.driver_id         Car driver id
  * @apiSuccess {String}   cars.driver            Car driver name
  * @apiSuccess {Number}   cars.seats             Car avaiable seats for carpooling
  * @apiSuccess {String}   car.comments           Car driver comments
  * @apiSuccess {Object[]} car.passanger          Each car passenger (there is a typo error)
  * @apiSuccess {ObjectId} car.passanger.user_id  Passenger user id  
  * @apiSuccess {String}   car.passanger.name     Passenger name
  * @apiSuccess {String}   car.passanger.photo    Passenger photo
  * @apiSuccess {Object[]} location               Location: longitude and latitude.
  * @apiSuccess {Date}     created_at             Document creation  date
  * @apiSuccess {Date}     updated_at             Last updated
  */
  router.get('/events/past', eventsController.past);  

  /**
  * @api {post} events/new New event
  * @apiName New
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
  router.post('/events/new', eventsController.create);          
  /**
  * @api {get} events/:id Show an event 
  * @apiName show
  * @apiGroup Events
  * @apiDescription Display an event details
  * @apiParam {String}     [id]                  Event id
  *
  * @apiSuccess {ObjectId} id                     Mongo generated ID.
  * @apiSuccess {String}   name                   Event name
  * @apiSuccess {String}   description            Event full description
  * @apiSuccess {String}   address                Full place address 
  * @apiSuccess {String}   place                  Event venue  name
  * @apiSuccess {String}   place_id               Id from google place api (unique)
  * @apiSuccess {String}   organizer              Organizer full name
  * @apiSuccess {ObjectId} organizer_id           Organizer user ID
  * @apiSuccess {String}   category               Event category
  * @apiSuccess {Date}     datetime               Event date and time
  * @apiSuccess {String[]} tags                   List of tags (Array of Strings)
  * @apiSuccess {Object[]} cars                   Avaiable cars array
  * @apiSuccess {ObjectId} cars.driver_id         Car driver id
  * @apiSuccess {String}   cars.driver            Car driver name
  * @apiSuccess {Number}   cars.seats             Car avaiable seats for carpooling
  * @apiSuccess {String}   car.comments           Car driver comments
  * @apiSuccess {Object[]} car.passanger          Each car passenger (there is a typo error)
  * @apiSuccess {ObjectId} car.passanger.user_id  Passenger user id  
  * @apiSuccess {String}   car.passanger.name     Passenger name
  * @apiSuccess {String}   car.passanger.photo    Passenger photo
  * @apiSuccess {Object[]} location               Location: longitude and latitude.
  * @apiSuccess {Date}     created_at             Document creation  date
  * @apiSuccess {Date}     updated_at             Last updated
  */
  router.get('/events/:id', eventsController.show);             //Show an event


router.get('/events/user/:user', eventsController.byuser);    // List  by user
router.post('/events/carbyuser', eventsController.carbyuser); // Car polling by user


router.put('/events/signup/:id', eventsController.signup);    // Event sign up
router.put('/events/:id', eventsController.update);           //Update an event
router.post('/events/addcar', eventsController.addCar);       //Add a car
router.post('/events/deletecar', eventsController.deleteCar); //Delete a car
router.post('/events/joincar', eventsController.joinCar);     //Join a car
router.post('/events/addExtra', eventsController.addExtra);   //Add extra passanger
router.post('/events/leavecar', eventsController.leaveCar);   //Leave a car
router.post('/events/carbyuser', eventsController.carbyuser); //Car polling by user
router.delete('/events/:id', eventsController.remove);        //Delete an event

// ----Locations --------
router.get('/locations', locationController.list);
router.get('/location/:id', locationController.show);
router.post('/locations', locationController.create);
router.put('/locations/:id', locationController.update);
router.delete('/locations/:id', locationController.remove);

// ----Settings ------
router.get('/settings', settingsController.show);
router.post('/settings', settingsController.update);

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
* @api {post} users/create Create user
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
router.post('/users/create', userController.create);


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
router.post('/chats/add', chatController.addMessage);


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
router.get('/chats/:rideid', chatController.getMessages);


module.exports = router;
