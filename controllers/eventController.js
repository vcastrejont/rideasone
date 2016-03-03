var eventModel = require('../models/eventModel.js');

/**
 * eventController.js
 *
 * @description :: Server-side logic for managing events.
 */
module.exports = {
    /**
     * eventController.list()
     */
    list: function(req, res) {
        eventModel.find(function(err, events){
            if(err) {
                return res.json(500, {
                    message: 'Error getting event.'
                });
            }
            return res.json(events);
        });
    },
    /**
     * eventController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        eventModel.findOne({_id: id}, function(err, event){
            if(err) {
                return res.json(500, {
                    message: 'Error getting event.'
                });
            }
            if(!event) {
                return res.json(404, {
                    message: 'No such event'
                });
            }
            return res.json(event);
        });
    },
    /**
     * eventController.addEvent()
     */
    create: function(req, res) {
      var event= new eventModel({
        location_id   : req.body.location_id,
        place         : req.body.place,
        place_id      : req.body.place_id,
        organizer_id  : req.user.id,
        organizer     : req.user.name,
        name          : req.body.name,
				description   : req.body.description,
        category      : req.body.category,
				datetime      : req.body.datetime,
        tags          : req.body.tags
      });
  
      event.save(function(err, event){
        if(err) {
            return res.json(500, {
                message: 'Error saving event',
                error: err
            });
        }
        return res.json({
                message: 'saved',
                _id: event._id
            });
      });
    },
    /**
     * eventController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        eventModel.findByIdAndRemove(id, function(err, event){
            if(err) {
                return res.json(500, {
                    message: 'Error getting event.'
                });
            }
            return res.json(event);
        });
    },
    /**
     * eventController.update()
     */
    update: function(req, res) {
      var id = req.params.id;
      eventModel.findOne({_id: id}, function(err, event){
          if(err) {
              return res.json(500, {
                  message: 'Error saving event',
                  error: err
              });
          }
          if(!event) {
              return res.json(404, {
                  message: 'No such event'
              });
          }

          event.name =  req.body.name ? req.body.name : event.name;		
          event.save(function(err, event){
              if(err) {
                  return res.json(500, {
                      message: 'Error getting event.'
                  });
              }
              if(!event) {
                  return res.json(404, {
                      message: 'No such event'
                  });
              }
              return res.json(event);
          });
      });
    },

    /**
     * eventController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        eventModel.findByIdAndRemove(id, function(err, event){
            if(err) {
                return res.json(500, {
                    message: 'Error getting event.'
                });
            }
            return res.json(event);
        });
    }
};
