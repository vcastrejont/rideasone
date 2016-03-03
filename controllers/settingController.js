var settingModel = require('../models/settingModel.js');

module.exports = {

    show: function(req, res) {
      settingModel.findOne(function(err, setting){
          if(err) {
              return res.json(500, {
                  message: 'Error getting settings.'
              });
          }
            return res.json(setting);
        });
    },

    update: function(req, res) {
      var id = req.body._id;
      settingModel.findOne({_id: id}, function(err, setting){
        if(err) {
            return res.json(500, {
                message: 'Error saving setting',
                error: err
            });
        }    
        setting.business_name =  req.body.business_name ? req.body.business_name : setting.business_name;
        setting.logo =  req.body.logo ? req.body.logo : setting.logo;
        setting.url =  req.body.url ? req.body.url : setting.url;      
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
            console.log(setting);
            return res.json(setting);
        });
      });
    },

    
};
