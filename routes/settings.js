var express = require('express');
var router = express.Router();
var settingModel = require('../models/settingModel.js');

/*
 * GET
 */
router.get('/', function(req, res) {
  settingModel.findOne(function(err, settings){
      if(err) {
          return res.json(500, {
              message: 'Error getting settings.'
          });
      }
      res.render('settings/index', { 'settings_data': settings });
      
  });      
});

/*
 * Update
 */
router.post('/:id', function(req, res) {
      console.log(req.body);
      var id = req.params.id;
      
      settingModel.findOne({_id: id}, function(err, setting){
        if(err) {
            return res.json(500, {
                message: 'Error saving setting',
                error: err
            });
        }
        if(!setting) {
            return res.json(404, {
                message: 'No such setting'
            });
        }
        console.log(setting);
        console.log("----");
        setting.business_name =  req.body.business_name ? req.body.business_name : setting.business_name;
  			setting.logo =  req.body.logo ? req.body.logo : setting.logo;
  			setting.url =  req.body.url ? req.body.url : setting.url;
		    console.log(req.body);
          
        setting.save(function(err, setting){
            if(err) {
                return res.json(500, {
                    message: 'Error getting setting.'
                });
            }
            if(!setting) {
                return res.json(404, {
                    message: 'No such setting'
                });
            }
            return res.json(setting);
        });
      });

});


module.exports = router;
