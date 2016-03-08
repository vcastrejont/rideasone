var express = require('express');
var router = express.Router();
var settingsController = require('../controllers/settingController.js');
var eventsController = require('../controllers/eventController.js'); 
var locationController = require('../controllers/locationController.js');
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
//      Show an event
router.get('/event/:id', eventsController.show);
//      Update an event
router.put('/events/:id', eventsController.update);
//      Delete an event
router.delete('/events/:id', eventsController.remove);



// ----Locations --------
router.get('/locations', locationController.list);
router.get('/location/:id', locationController.show);
router.post('/locations', locationController.create);
router.put('/locations/:id', locationController.update);
router.delete('/locations/:id', locationController.remove);



module.exports = router;
