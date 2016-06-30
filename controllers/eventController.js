var Event = require('../models/event.js');
var User = require('../models/user.js');
var mailerController = require('../controllers/mailerController.js');
var mongoose = require('mongoose');
/**
 * eventController.js
 *
 * @description :: Server-side logic for managing events.
 */
module.exports = {
  /**
   * List all the events from yesterday to the end of the time.
   */
  list: function (req, res) {
    Event.getEventsSinceYesterday()
      .then(function (events) {
        res.json(events);
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  },
  /**
   * List all the events up to yesterday.
   */
  past: function (req, res) {
    Event.getEventsUntilYesterday()
      .then(function (events) {
        res.json(events);
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  },
  /**
   * eventController.byuser()
   */
  user: function (req, res) {
    // TODO: Once passport is implemented, get the user from req.user
    var userId = req.params.user;

    User.findById(userId)
      .then(function (user) {
        return user.getEvents();
      })
      .then(function (events) {
        res.json(events);
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  },
  /**
  * eventController.carbyuser()
  */
  carbyuser: function (req, res) {
    var eventId = req.body.event_id;
    var userId = req.body.user_id;
    var resultData = {};
    Event.findOne({_id: eventId}, function (err, event) {
      if (err) {
        return res.json(500, {
          message: 'Error getting event.'
        });
      }
      if (!event) {
        return res.json(404, {
          message: 'No such event'
        });
      }
      event.cars.forEach(function (car, index) {
        if (car.driver_id === userId) {
          resultData = car;
        } else {
          car.passanger.forEach(function (passanger, index) {
            if (passanger.user_id === userId) {
              resultData = car;
            }
          });
        }
      });
      res.status(200).json(resultData);
    });
  },
  /**
   * eventController.show()
   */
  show: function (req, res) {
    var eventId = req.params.id;
    Event.findById(eventId)
      .then(function (event) {
        return res.json(event);
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  },
  /**
   * eventController.addEvent()
   */
  create: function (req, res) {
    req.user.createEvent(req.body)
      .then(function (event) {
        res.json({ _id: event.id });
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  },
  /**
   * eventController.remove()
   */
  remove: function (req, res) {
    var eventId = req.params.id;
    Event.findByIdAndRemove(eventId)
      .then(function (event) {
        return res.json(event);
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  },
  /**
   * eventController.drivers()
   */
  drivers: function (req, res) {
    var id = req.params.id;
    Event.aggregate([
      { $match: {
        'attendees.n_seats': {$exists: true},
        '_id': mongoose.Types.ObjectId(id)
      }},
      { $unwind: '$attendees' },
      { $match: {
        'attendees.n_seats': {$exists: true}
      }},
      { '$project': {
        '_id': 0,
        'attendees.user_id': 1,
        'attendees.user': 1,
        'attendees.n_seats': 1
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
  byDriver: function (req, res) {
    var driverId = req.params.id;
    Event.find({'cars.driver_id': mongoose.Types.ObjectId(driverId)}, function (err, events) {
      if (err) {
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
  addCar: function (req, res) {
    Event.findOne({_id: req.body.id}, function (err, event) {
      if (err) return res.json(500, { message: 'Error', error: err });
      var car = {
        driver_id: req.user.id,
        driver_name: req.user.name,
        driver_photo: req.user.photo,
        driver_email: req.user.email,
        seats: req.body.seats,
        comments: req.body.comments
      };

      Event.update({'_id': req.body.id}, {$push: {'cars': car}},
        function (err, numAffected) {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Error updating event', error: err
            });
          } else {
            return res.status(200).json({
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
  deleteCar: function (req, res) {
    var id = req.body.id;
    var car_id = req.body.carid;
    Event.update({_id: id},
      {'$pull': {'cars': {'_id': car_id}}}, function (err, numAffected) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error updating event', error: err
          });
        } else {
          console.log(numAffected);
          return res.status(200).json({
            message: 'Successfully deleted',
            numAffected: numAffected
          });
        }
      });
  },
  /**
   * eventController Join car()
   */
  joinCar: function (req, res) {
    var event_id = req.body.event_id;
    var car_id = req.body.car_id;
    var passenger = {
      passenger_id: req.user.id,
      passenger_name: req.user.name,
      passenger_photo: req.user.photo
    };

    Event.update({_id: event_id, 'cars._id': car_id },
      {'$push': {'cars.$.passengers': passenger}},

      function (err, numAffected) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error updating event', error: err
          });
        } else {
          Event.findOne({_id: event_id}, function (err, event) {
            var car = _.filter(event.cars, function (item) {
              return item._id.toString() === car_id;
            });
            mailerController.joinCar(passenger.passenger, event.name, car[0].driver_email);
          });

          return res.status(200).json({
            message: 'Successfully added!',
            numAffected: numAffected
          });
        }
      });
  },

  /**
   * eventController addExtra()
   */
  addExtra: function (req, res) {
    var event_id = req.body.event_id;
    var car_id = req.body.car_id;
    var extra = req.body.extra;
    var passenger = {
      user_id: req.user.id,
      name: req.user.name,
      photo: req.user.photo
    };
    for (i = 0; i < extra; i++) {
      Event.update({_id: event_id, 'cars._id': car_id },
        {'$push': {'cars.$.passengers': passenger}},
        function (err, numAffected) {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Error updating event', error: err
            });
          } else {
            // nothing here
          }
        });
    }
    return res.status(200).json({
      message: 'Successfully added!'
    });

  },

  /**
   * eventController Leave a car()
   */
  leaveCar: function (req, res) {
    var event_id = req.body.event_id;
    var car_id = req.body.car_id;
    var passenger = {
      passenger_id: req.user.id,
      passenger_name: req.user.name
    };
    Event.update({_id: event_id, 'cars._id': car_id },
      {'$pull': {'cars.$.passengers': {'user_id': req.user.id }}},

      function (err, numAffected) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error updating event', error: err
          });
        } else {
          Event.findOne({_id: event_id}, function (err, event) {
            var car = _.filter(event.cars, function (item) {
              return item._id.toString() === car_id;
            });
            mailerController.leaveCar(passenger.passenger_name, event.name, car[0].driver_email);
          });

          return res.status(200).json({
            message: 'Successfully removed',
            numAffected: numAffected
          });
        }
      });
  },

  /**
   * eventController.update()
   */
  update: function (req, res) {
    var id = req.params.id;
    // Find event
    Event.findOne({_id: id}, function (err, event) {
      if (err) {
        return res.json(500, {
          message: 'Error', error: err
        });
      }
      if (event) { // Event   found
        if (req.body.option == 1) { // if user wants to share a ride
          var cars = {
            driver_id: req.user.id,
            driver: req.user.name,
            driver_photo: req.user.photo,
            seats: req.body.seats,
            comments: req.body.comments
          };
          Event.update({'_id': id}, {$push: {'cars': cars}}, function (err, numAffected) {
            if (err) {
              console.log(err);
              return res.status(500).json({
                message: 'Error updating event', error: err
              });
            } else {
              console.log(numAffected);
              return res.status(200).json({
                message: 'Successfully added!',
                numAffected: numAffected
              });
            }
          });

        } else { // if user doenst have car
          if (req.body.driver) { // if user found a driver
            Event.update({_id: id, 'attendees.user_id': req.user.id },
              {'$set': {'attendees.$.lift': false}}, // he is not longer looking for a lift
              function (err, numAffected) {
                if (err) {
                  console.log(err);
                  return res.status(500).json({
                    message: 'Error updating event', error: err
                  });
                } else {
                  var passanger = {
                    user_id: req.user.id,
                    name: req.user.name,
                    photo: req.user.photo
                  };

                  Event.update({_id: id, 'cars.driver_id': req.body.driver },
                    {'$push': {'cars.$.passanger': passanger}}, // he is not longer looking for a lift

                    function (err, numAffected) {
                      if (err) {
                        console.log(err);
                        return res.status(500).json({
                          message: 'Error updating event', error: err
                        });
                      } else {
                        return res.status(200).json({
                          message: 'Successfully added!',
                          numAffected: numAffected
                        });
                      }
                    });
                }
              });

          } else { // user has no driver and  needs a lift
            Event.update({_id: id, 'attendees.user_id': req.user.id },
              {'$set': {'attendees.$.lift': true}},
              function (err, numAffected) {
                if (err) {
                  return res.status(500).json({
                    message: 'Error updating event', error: err
                  });
                } else {
                  return res.status(200).json({
                    message: 'Successfully added!',
                    numAffected: numAffected
                  });
                }
              });
          }
        }
      } else { // Event not found
        return res.json(404, {message: 'No such event'});
      }
    });
  },

  /**
   * eventController.signup()  Event sign up
   */
  signup: function (req, res) {
    var id = req.params.id;
    var attendees = {
      user_id: req.user.id,
      user: req.user.name,
      photo: req.user.photo,
      lift: false,
      comments: req.body.comments
    };
    Event.findOne({_id: id}, function (err, event) {
      if (err) {
        return res.json(500, {
          message: 'Error accesing event', error: err
        });
      }
      if (!event) {
        return res.json(404, {message: 'No such event'});
      }
      Event.findOne({'_id': id, 'attendees.user_id': req.user.id}, function (err, attendee) {
        if (attendee) {
          console.log('Already exists');
          return res.json(200, {message: 'Already signed'});
        } else {
          Event.update({'_id': id}, {$push: {'attendees': attendees}}, function (err, numAffected) {
            if (err) {
              console.log(err);
            } else {
              console.log('Successfully added to event');
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
  }

};
