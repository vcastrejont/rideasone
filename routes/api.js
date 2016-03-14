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
router.get('/events', eventsController.list);
router.post('/events', eventsController.create);

// ----Locations --------
router.get('/locations', locationController.list);
router.get('/location/:id', locationController.show);
router.post('/locations', locationController.create);
router.put('/locations/:id', locationController.update);
router.delete('/locations/:id', locationController.remove);

// ----Chat --------
router.get('/chat', function(req, res) {
  console.log(req);
});

module.exports = router;
