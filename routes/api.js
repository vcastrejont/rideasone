var express = require('express');
var router = express.Router();
var settingsController = require('../controllers/settingController.js');
var eventsController = require('../controllers/eventController.js');
var locationController = require('../controllers/locationController.js');

var routesController = require('../controllers/routesController.js');

var userController = require('../controllers/userController.js');
// var chatController = require('../controllers/chatController.js');


router.get('/', function(req, res) {
 res.send('API list');
});



// ----Events --------
router.get('/events', eventsController.list);                 // List events
router.get('/events/past', eventsController.past);            // List  past events
router.get('/events/user/:user', eventsController.byuser);    // List  by user
router.post('/events/carbyuser', eventsController.carbyuser); // Car polling by user
router.post('/events', eventsController.create);              //Create a new event
router.get('/events/:id', eventsController.show);             //Show an event
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
router.get('/users', userController.list);
router.post('/users/create', userController.create);

// ----Chat --------
// router.get('/chat/messages/:rideId', chatController.getMessages);
// router.post('/chat/addMessage', chatController.addMessage);

module.exports = router;
