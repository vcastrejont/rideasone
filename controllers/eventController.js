var eventModel = require('../models/eventModel.js');
var mailerController = require('../controllers/mailerController.js');
var mongoose = require('mongoose');
var _ = require('underscore');
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
      var d = new Date();
      d.setDate(d.getDate() - 1);
      eventModel.find({"datetime":{"$gte": d}}, {}, { limit : 5, sort: "datetime" },function(err, events){
          if(err) {
              return res.json(500, {
                  message: 'Error getting event.'
              });
          }
          return res.json(events);
      });
    },

    past: function(req, res) {
      var d = new Date();
      d.setDate(d.getDate() - 1);
      eventModel.find({"datetime":{"$lt": d }},{}, { limit : 5, sort: {datetime: -1} },function(err, events){
          if(err) {
              return res.json(500, {
                  message: 'Error getting event.'
              });
          }
          return res.json(events);
      });
    },
    /**
     * eventController.byuser()
     */
    byuser: function(req, res) {
      var d = new Date();
      var user = req.params.user;
      d.setDate(d.getDate() - 1);
      eventModel.find({"datetime":{"$gte": d}, "attendees.user_id": user }, {}, { sort: "datetime" },function(err, events){
          if(err) {
              return res.json(500, {
                  message: 'Error getting event.'
              });
          }
          return res.json(events);
      });
    },
    /**
     * eventController.carbyuser()
     */
     /**
      * eventController.carbyuser()
      */
     carbyuser: function(req, res) {
         var event_id = req.body.event_id;
         var user_id = req.body.user_id;
         var result_data = {};
         eventModel.findOne({_id: event_id}, function(err, event){
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

             _.each(event.cars, function(car, index) {
               if(car.driver_id == user_id) {
                 result_data = car;
               }
               else {
                 _.each(car.passanger, function(passanger, index) {
                   if(passanger.user_id == user_id) {
                     result_data = car;
                   }
                 });
               }
             });

             res.status(200).json(result_data);
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
        address       : req.body.address,
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
     * eventController.drivers()
     */
    drivers: function(req, res) {
      var id = req.params.id;
      eventModel.aggregate([
        { $match : {
           "attendees.n_seats": {$exists: true},
           "_id":  mongoose.Types.ObjectId(id)
        }},
        { $unwind : "$attendees" },
        { $match : {
           "attendees.n_seats": {$exists: true}
        }},
        { "$project": {
        "_id": 0,
        "attendees.user_id": 1,
        "attendees.user": 1,
        "attendees.n_seats": 1
         }}
      ], function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        return res.json(result);
      });
    },
    /**
     * eventController.drivers()
     */
    byDriver: function(req, res) {
      var id = req.params.id;
      eventModel.find({"cars.driver_id":mongoose.Types.ObjectId(id)}, function(err, events){
          if(err) {
              return res.json(500, {
                  message: 'Error getting event.'
              });
          }
          return res.json(events);
      });
    },
    /**
     * eventController.Add car()
     */
    addCar: function(req, res) {
      eventModel.findOne({_id: req.body.id}, function(err, event){
        if(err)
          return res.json(500, {  message: 'Error', error: err  });
        var car = {
          driver_id     : req.user.id,
          driver        : req.user.name,
          driver_photo  : req.user.photo,
          driver_email  : req.user.email,
          seats         : req.body.seats,
          comments      : req.body.comments
        };

        eventModel.update({"_id":  req.body.id}, {$push: {"cars": car}},
        function(err, numAffected){
          if(err){
              console.log(err);
              return res.status(500).json( {
                  message: 'Error updating event', error: err
              });
          }else{

            return res.status(200).json( {
                message: 'Successfully added!',
                numAffected: numAffected
            });
          }
        });
      });
    },
    /**
     * eventController delete car()
     */
    deleteCar: function(req, res) {
      var id = req.body.id;
      var car_id = req.body.carid;
      eventModel.update({_id: id},
      {'$pull': {"cars": {"_id": car_id}}}, function(err, numAffected){
        if(err){
            console.log(err);
            return res.status(500).json( {
                message: 'Error updating event', error: err
            });
        }else{
          console.log(numAffected);
          return res.status(200).json( {
              message: 'Successfully deleted',
              numAffected: numAffected
          });
        }
      });
    },
    /**
     * eventController Join car()
     */
    joinCar: function(req, res) {
      var event_id = req.body.event_id;
      var car_id = req.body.car_id;
      var passanger = {
        user_id   : req.user.id,
        name      : req.user.name,
        photo     : req.user.photo
      }

      eventModel.update({_id: event_id, 'cars._id': car_id },
      {'$push': {"cars.$.passanger": passanger}},

      function(err, numAffected){
        if(err){
          console.log(err);
          return res.status(500).json( {
              message: 'Error updating event', error: err
          });
        }else{
          eventModel.findOne({_id: event_id}, function(err, event){
            var car = _.filter(event.cars, function (item) {
              return item._id.toString() === car_id;
            })
            mailerController.joinCar(passanger.name, event.name, car[0].driver_email);
          });

          return res.status(200).json( {
              message: 'Successfully added!',
              numAffected: numAffected
          });
        }
      });
    },

    /**
     * eventController addExtra()
     */
    addExtra: function(req, res) {
      var event_id  = req.body.event_id;
      var car_id    = req.body.car_id;
      var extra     = req.body.extra;
      var passanger = {
        user_id   : req.user.id,
        name      : req.user.name,
        photo     : req.user.photo
      }
      for (i = 0; i < extra; i++) {
        eventModel.update({_id: event_id, 'cars._id': car_id },
        {'$push': {"cars.$.passanger": passanger}},
        function(err, numAffected){
          if(err){
            console.log(err);
            return res.status(500).json( {
                message: 'Error updating event', error: err
            });
          }else{
            //nothing here
          }
        });
      }
      return res.status(200).json( {
          message: 'Successfully added!'
      });

    },

    /**
     * eventController Leave a car()
     */
    leaveCar: function(req, res) {

      var event_id  = req.body.event_id;
      var car_id    = req.body.car_id;
      var passanger = {
        user_id   : req.user.id,
        name      : req.user.name,
        photo     : req.user.photo
      }
      eventModel.update({_id: event_id, 'cars._id': car_id },
      {'$pull': {"cars.$.passanger": {'user_id':req.user.id }}},

      function(err, numAffected){
        if(err){
          console.log(err);
          return res.status(500).json( {
              message: 'Error updating event', error: err
          });
        }else{
          eventModel.findOne({_id: event_id}, function(err, event){
            var car = _.filter(event.cars, function (item) {
              return item._id.toString() === car_id;
            });
            mailerController.leaveCar(passanger.name, event.name, car[0].driver_email);
          });

          return res.status(200).json( {
              message: 'Successfully removed',
              numAffected: numAffected
          });
        }
      });
    },

    /**
     * eventController.update()
     */
    update: function(req, res) {
      var id = req.params.id;
      // Find event
      eventModel.findOne({_id: id}, function(err, event){
        if(err) {
          return res.json(500, {
              message: 'Error', error: err
          });
        }
        if(event) {//Event   found
          if (req.body.option==1){//if user wants to share a ride
            var cars = {
              driver_id   : req.user.id,
              driver      : req.user.name,
              driver_photo: req.user.photo,
              seats       : req.body.seats,
              comments    : req.body.comments
            }
            eventModel.update({"_id": id}, {$push: {"cars": cars}}, function(err, numAffected){
              if(err){
                  console.log(err);
                  return res.status(500).json( {
                      message: 'Error updating event', error: err
                  });
              }else{
                console.log(numAffected);
                return res.status(200).json( {
                    message: 'Successfully added!',
                    numAffected: numAffected
                });
              }
            });

          }else{//if user doenst have car
            if(req.body.driver){//if user found a driver
              eventModel.update({_id: id, 'attendees.user_id': req.user.id },
              {'$set': {'attendees.$.lift': false}}, //he is not longer looking for a lift
              function(err, numAffected){
                if(err){
                  console.log(err);
                  return res.status(500).json( {
                      message: 'Error updating event', error: err
                  });
                }else{
                  var passanger = {
                    user_id   : req.user.id,
                    name      : req.user.name,
                    photo     : req.user.photo
                  }

                  eventModel.update({_id: id, 'cars.driver_id': req.body.driver },
                  {'$push': {"cars.$.passanger": passanger}}, //he is not longer looking for a lift

                  function(err, numAffected){
                    if(err){
                      console.log(err);
                      return res.status(500).json( {
                          message: 'Error updating event', error: err
                      });
                    }else{
                      return res.status(200).json( {
                          message: 'Successfully added!',
                          numAffected: numAffected
                      });
                    }
                  });
                }
              });

            }else{// user has no driver and  needs a lift
              eventModel.update({_id: id, 'attendees.user_id': req.user.id },
              {'$set': {'attendees.$.lift': true}},
              function(err, numAffected){
                if(err){
                  return res.status(500).json( {
                      message: 'Error updating event', error: err
                  });
                }else{
                  return res.status(200).json( {
                      message: 'Successfully added!',
                      numAffected: numAffected
                  });
                }
              });
            }
          }
        }else{//Event not found
          return res.json(404, {message: 'No such event'});
        }
      });
    },

    /**
     * eventController.signup()  Event sign up
     */
    signup: function(req, res) {
      var id = req.params.id;
      var attendees = {
        user_id   : req.user.id,
        user      : req.user.name,
        photo     : req.user.photo,
        lift      : false,
        comments  : req.body.comments
      }
      eventModel.findOne({_id: id}, function(err, event){
        if(err) {
          return res.json(500, {
              message: 'Error accesing event', error: err
          });
        }
        if(!event) {
          return res.json(404, {message: 'No such event'});
        }
        eventModel.findOne({"_id":id, "attendees.user_id": req.user.id}, function(err, attendee){
          if(attendee){
            console.log("Already exists");
            return res.json(200, {message: 'Already signed'});
          }else{
            eventModel.update({"_id": id}, {$push: {"attendees": attendees}}, function(err, numAffected){
              if(err){
                      console.log(err);
              }else{
                      console.log("Successfully added to event");
                      return res.json(200, {message: 'Successfully added to event'});
              }
            });
          }
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
