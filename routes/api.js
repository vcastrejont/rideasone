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

// ----Settings ------
router.get('/settings', settingsController.show);
router.post('/settings', settingsController.update);

// ----Events --------
//      List events
router.get('/events', eventsController.list);
//      Create a new event
router.post('/events', eventsController.create);
//    Car polling by user
router.post('/events/carbyuser', eventsController.carbyuser);
//      Show an event
router.get('/event/:id', eventsController.show);
//      Event sign up
router.put('/event/signup/:id', eventsController.signup);
//      Update an event
router.put('/events/:id', eventsController.update);
//      Add a car
router.post('/events/addcar', eventsController.addCar);
//      Delete a car
router.post('/events/deletecar', eventsController.deleteCar);
//      Delete an event
router.post('/events/joincar', eventsController.joinCar);
//     Leave a car
router.post('/events/leaveCar', eventsController.leaveCar);
//      Delete an event
router.delete('/event/:id', eventsController.remove);
//      Driver available for  an event
router.get('/events/drivers/:id', eventsController.drivers);
//      Events for a driver
router.get('/events_driver/:id', eventsController.byDriver);


// ----Locations --------
router.get('/locations', locationController.list);
router.get('/location/:id', locationController.show);
router.post('/locations', locationController.create);
router.put('/locations/:id', locationController.update);
router.delete('/locations/:id', locationController.remove);

// ----Users --------
router.get('/users', userController.list);
router.post('/users/create', userController.create);

// ----Chat --------
router.post('/chat/addMessage', chatController.addMessage);

module.exports = router;
