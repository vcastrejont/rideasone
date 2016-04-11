var express             = require('express');
var router              = express.Router();
var settingsController  = require('../controllers/settingController.js');
var eventsController    = require('../controllers/eventController.js');
var locationController  = require('../controllers/locationController.js');
var userController      = require('../controllers/userController.js');


// ----Events --------
router.get('/events', eventsController.list);                 // List events
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

module.exports = router;
