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
// ----Locations --------
router.get('/', locationController.list);
router.get('/:id', locationController.show);
router.post('/', locationController.create);
router.put('/:id', locationController.update);
router.delete('/:id', locationController.remove);


module.exports = router;
