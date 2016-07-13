var Event = require('../models/event.js');
var User = require('../models/user.js');
var Ride = require('../models/ride.js');
var mailerController = require('../controllers/mailerController.js');
var mongoose = require('mongoose');
var Transaction = require('lx-mongoose-transaction')(mongoose);
var _ = require('lodash');

/**
 * eventController.js
 *
 * @description :: Server-side logic for managing events.
 */
module.exports = {
  /**
   * List all the events from yesterday to the end of the time.
   */
  list: function(req, res) {
    Event.getCurrentEvents()
      .then(function(events) {
        res.json(events);
      })
      .catch(function(err) {
        res.status(500).json({
          message: err.message
        });
      });
  },
  /**
   * List all the events up to yesterday.
   */
  past: function(req, res) {
    Event.getPastEvents()
      .then(function(events) {
        res.json(events);
      })
      .catch(function(err) {
        res.status(500).json({
          message: err.message
        });
      });
  },
  /**
   * eventController.byuser()
   */
  user: function(req, res) {
    // TODO: Once passport is implemented, get the user from req.user
    var userId = req.params.user;

    User.findById(userId)
      .then(function(user) {
        return user.getEvents();
      })
      .then(function(events) {
        res.json(events);
      })
      .catch(function(err) {
        res.status(500).json({
          message: err.message
        });
      });
  },
  /**
   * eventController.carbyuser()
   */
  carbyuser: function(req, res) {
    var eventId = req.body.event_id;
    var userId = req.body.user_id;
    var resultData = {};
    Event.findOne({
      _id: eventId
    }, function(err, event) {
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
      event.cars.forEach(function(car, index) {
        if (car.driver_id === userId) {
          resultData = car;
        } else {
          car.passanger.forEach(function(passanger, index) {
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
  show: function(req, res) {
    var eventId = req.params.id;
    Event.findById(eventId)
      .then(function(event) {
        return res.json(event);
      })
      .catch(function(err) {
        res.status(500).json({
          message: err.message
        });
      });
  },
  /**
   * eventController.addEvent()
   */
  create: function(req, res) {
    User.findById(req.body.organizer)
      .then(user => {
        return user.createEvent(req.body);
      })
      .then(function(event) {
        res.json({
          _id: event._id
        });
      })
      .catch(function(err) {
        res.status(500).json({
          message: err.message
        });
      });
  },
  /**
   * eventController.remove()
   */
  remove: function(req, res) {
    var eventId = req.params.event;
    Event.findByIdAndRemove(eventId)
      .then(function(event) {
        return res.json(event);
      })
      .catch(function(err) {
        res.status(500).json({
          message: err.message
        });
      });
  },
  /**
   * eventController.drivers()
   */
  drivers: function(req, res) {
    var id = req.params.id;
    Event.aggregate([{
      $match: {
        'attendees.n_seats': {
          $exists: true
        },
        '_id': mongoose.Types.ObjectId(id)
      }
    }, {
      $unwind: '$attendees'
    }, {
      $match: {
        'attendees.n_seats': {
          $exists: true
        }
      }
    }, {
      '$project': {
        '_id': 0,
        'attendees.user_id': 1,
        'attendees.user': 1,
        'attendees.n_seats': 1
      }
    }], function(err, result) {
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
    var driverId = req.params.id;
    Event.find({
      'cars.driver_id': mongoose.Types.ObjectId(driverId)
    }, function(err, events) {
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
  addCar: function(req, res) {
    var transaction = new Transaction();
    var eventToEdit;
    var ridesToPush = {
      going_rides: []
    };

  },
  /**
   * eventController delete car()
   */
  deleteCar: function(req, res) {
    var id = req.body.id;
    var car_id = req.body.carid;
    eventModel.update({
      _id: id
    }, {
      '$pull': {
        "cars": {
          "_id": car_id
        }
      }
    }, function(err, numAffected) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Error updating event',
          error: err
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
  joinCar: function(req, res) {
    var event_id = req.body.event_id,
      car_id = req.body.car_id,
      passenger = {
        passenger_id: req.user.id,
        passenger_name: req.user.name,
        passenger_photo: req.user.photo,
        going: !!req.body.going,
        back: !!req.body.back
      };

    Event.findOne({
        _id: req.params.event
      })
      .then(function(event) {
        eventToEdit = event;
        var car = {
          driver: req.body.driverId,
          seats: req.body.seats,
          comments: req.body.comments
        };

        if (req.body.going === true) {
          transaction.insert('Ride', car);
          return transaction.run()
            .then((createdRide) => {
              eventToEdit.going_rides.push(createdRide[0]._id);
            });
        }
      })
      .then(() => {
        if (req.body.returning === true) {
          transaction.insert('Ride', car);
          return transaction.run()
            .then((createdRide) => {
              eventToEdit.returning_rides.push(createdRide[0]._id);
            });
        }
      })
      .then(function() {
        transaction.update('Event', {
          '_id': req.params.event
        }, {
          going_rides: eventToEdit.going_rides,
          returning_rides: eventToEdit.returning_rides
        });
        return transaction.run();
      })
      .then(function(updatedEvent) {
        console.log(updatedEvent);
        var numAffected = updatedEvent.length;
        return res.status(200).json({
          message: 'Successfully added!',
          numAffected: numAffected
        });
      })
      .catch(function(err) {
        console.log(err);
        if (err) return res.json(500, {
          message: 'Error',
          error: err
        });
      });
  },

  /**
   * eventController delete car()
   */
  deleteCar: function(req, res) {
    var id = req.body.id;
    var car_id = req.body.carid;
    Event.update({
      _id: id
    }, {
      '$pull': {
        'cars': {
          '_id': car_id
        }
      }
    }, function(err, numAffected) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Error updating event',
          error: err
        });
      } else {
        return res.status(200).json({
          message: 'Successfully deleted',
          numAffected: numAffected
        });
      }
    });
  },
  edit: function(req, res) {
    var updates = _.pick(req.body, ['name', 'place', 'description', 'datetime', 'tags']);

    Event.update({
        _id: req.params.event
      }, {
        $set: updates
      })
      .then(function(event) {
        return res.status(200).json({
          message: 'Successfully edited',
        });
      })
      .catch(err => {
        return res.status(500).json({
          message: 'Error editing event',
          error: err
        });
      });
  },

  /**
   * eventController addExtra()
   */
  addExtra: function(req, res) {
    var event_id = req.body.event_id,
      car_id = req.body.car_id,
      extra_going = req.body.extra_going,
      extra_back = req.body.extra_back,
      passenger = {
        user_id: req.user.id,
        name: req.user.name,
        photo: req.user.photo,
        going: false,
        back: false
      }

    for (i = 0; i < extra_going; i++) {
      passenger.going = true;

      eventModel.update({
          _id: event_id,
          'cars._id': car_id
        }, {
          '$push': {
            "cars.$.passengers": passenger
          }
        },
        function(err, numAffected) {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Error updating event',
              error: err
            });
          } else {
            //nothing here
          }
        });
    }

    for (i = 0; i < extra_back; i++) {
      passenger.going = false;
      passenger.back = true;

      eventModel.update({
          _id: event_id,
          'cars._id': car_id
        }, {
          '$push': {
            "cars.$.passengers": passenger
          }
        },
        function(err, numAffected) {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Error updating event',
              error: err
            });
          } else {
            //nothing here
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
  leaveCar: function(req, res) {

    var event_id = req.body.event_id;
    var car_id = req.body.car_id;
    var passenger = {
      passenger_id: req.user.id,
      passenger_name: req.user.name
    }
    Event.findOne({
      '_id': id,
      'attendees.user_id': req.user.id
    }, function(err, attendee) {
      if (attendee) {
        console.log('Already exists');
        return res.json(200, {
          message: 'Already signed'
        });
      } else {
        Event.update({
          '_id': id
        }, {
          $push: {
            'attendees': attendees
          }
        }, function(err, numAffected) {
          if (err) {
            console.log(err);
          } else {
            console.log('Successfully added to event');
            return res.json(200, {
              message: 'Successfully added to event'
            });
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
  
      });*/
  },
  /**
   * eventController.remove()
   */
  remove: function(req, res) {
    var id = req.params.id;
    eventModel.findByIdAndRemove(id, function(err, event) {
      if (err) {
        return res.json(500, {
          message: 'Error getting event.'
        });
      }
      return res.json(event);
    });
  },

  messageDriver: function(req, res) {
    var eventId = req.params.id;
    var carId = req.params.carId;
    if (!req.body.message) return res.json(400, {
      message: 'The message is required'
    });

    eventModel.findById(eventId, function(err, event) {
      if (err) return res.json(500, {
        message: 'Error getting event.'
      });

      var car = _.find(event.cars, function(car) {
        return car['_id'] == carId;
      });

      if (!car) return res.json(400, {
        message: 'Invalid car ID'
      });

      mailerController.messageDriver({
        driver_email: car.driver_email,
        content: req.body.message,
        user_email: req.user.email
      }, function(err, response) {
        if (err) return res.send(500, {
          message: 'Error sending message'
        });

        console.log("Mail sent to: " + car.driver_email);
        res.sendStatus(200);
      })

    });
  }
};
