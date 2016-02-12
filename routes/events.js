var express = require('express');
var router = express.Router();
var locationModel = require('../models/locationModel.js');

/*
 * GET
 */
router.get('/', function(req, res) {
  var query = locationModel.find({events:{$exists:true}});
  query.exec(function(err, locations){
      if(err) {
          return res.json(500, {
              message: 'Error getting settings.'
          });
      }
      res.render('events/index', { 'locations': locations });  
  });      
});

/*
 * NEW
 */
router.get('/new', function(req, res) {
  res.render('events/new');  
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
