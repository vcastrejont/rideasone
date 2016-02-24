var express = require('express');
var router = express.Router();
var settingsController = require('../controllers/settingController.js');
var settingModel = require('../models/settingModel.js');
 
 
 // ----Settings
 router.get('/', function(req, res) {
   res.send('API list');
 });
router.get('/settings', settingsController.show);
router.post('/settings', settingsController.update);

module.exports = router;
