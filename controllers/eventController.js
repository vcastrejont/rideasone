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
        location      : req.body.location,
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
      console.log(event);
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
     * eventController.update()  addAttendee
     */
    update: function(req, res) {
      var id = req.params.id;
      var attendees = {
        user_id   : req.user.id,
        user      : req.user.name,
        n_seats   : req.body.n_seats
      }
      eventModel.findOne({_id: id}, function(err, event){
        if(err) {
          return res.json(500, {
              message: 'Error saving event', error: err
          });
        }
        if(!event) {
          return res.json(404, {message: 'No such event'});
        }
        eventModel.findOne({"attendees.user_id": req.user.id}, function(err, attendee){ 
          //if(attendee){
          //  console.log("Already exists");
            
          //}else{
            eventModel.update({"_id": id}, {$push: {"attendees": attendees}}, function(err, numAffected){
              if(err){
                      console.log(err);
              }else{
                      console.log("Successfully added");
              }
            });
          //}
        });   
          
        
        /*
        event.name =  req.body.name ? req.body.name : event.name;
        event.save(function(err, event){
          if(err)   
            return res.json(500, {  message: 'Error saving event.'});
          return res.json(event);
        });
        */
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
