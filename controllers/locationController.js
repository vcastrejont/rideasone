var locationModel = require('../models/locationModel.js');

/**
 * locationController.js
 *
 * @description :: Server-side logic for managing locations.
 */
module.exports = {

    /**
     * locationController.list()
     */
    list: function(req, res) {
        locationModel.find(function(err, locations){
            if(err) {
                return res.json(500, {
                    message: 'Error getting location.'
                });
            }
            return res.json(locations);
        });
    },

    /**
     * locationController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        locationModel.findOne({_id: id}, function(err, location){
            if(err) {
                return res.json(500, {
                    message: 'Error getting location.'
                });
            }
            if(!location) {
                return res.json(404, {
                    message: 'No such location'
                });
            }
            return res.json(location);
        });
    },

    /**
     * locationController.create()
     */
    create: function(req, res) {
        var location = new locationModel({			       name : req.body.name,
             location : req.body.location
        });

        location.save(function(err, location){
            if(err) {
                return res.json(500, {
                    message: 'Error saving location',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: location._id
            });
        });
    },

    /**
     * locationController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        locationModel.findOne({_id: id}, function(err, location){
            if(err) {
                return res.json(500, {
                    message: 'Error saving location',
                    error: err
                });
            }
            if(!location) {
                return res.json(404, {
                    message: 'No such location'
                });
            }

            location.name =  req.body.name ? req.body.name : location.name;			
            location.save(function(err, location){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting location.'
                    });
                }
                if(!location) {
                    return res.json(404, {
                        message: 'No such location'
                    });
                }
                return res.json(location);
            });
        });
    },
    
    
        /**
         * locationController.addEvent()
         */
        addEvent: function(req, res) {
          console.log(req);
            var id = req.body.id;
            var event= {
              name: req.body.name,
							description: req.body.description,
							datetime: req.body.datetime,
              category: req.body.category
            }
            locationModel.update({ "_id": id },
              {$push: { "events": event }},
              function(err, numAffected) {
                if(err) {
                  return res.json(500, {
                      message: 'Error saving location',
                      error: err
                  });
                }else { 
                  return res.json(numAffected);
                }});
      
      
        },
        

    /**
     * locationController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        locationModel.findByIdAndRemove(id, function(err, location){
            if(err) {
                return res.json(500, {
                    message: 'Error getting location.'
                });
            }
            return res.json(location);
        });
    }
};
