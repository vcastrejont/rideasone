var carModel = require('../models/carModel.js');

/**
 * carController.js
 *
 * @description :: Server-side logic for managing cars.
 */
module.exports = {

    /**
     * carController.list()
     */
    list: function(req, res) {
        carModel.find(function(err, cars){
            if(err) {
                return res.json(500, {
                    message: 'Error getting car.'
                });
            }
            return res.json(cars);
        });
    },

    /**
     * carController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        carModel.findOne({_id: id}, function(err, car){
            if(err) {
                return res.json(500, {
                    message: 'Error getting car.'
                });
            }
            if(!car) {
                return res.json(404, {
                    message: 'No such car'
                });
            }
            return res.json(car);
        });
    },

    /**
     * carController.create()
     */
    create: function(req, res) {
        var car = new carModel({			carDoor : 4,			color : "red"
        });

        car.save(function(err, car){
            if(err) {
                return res.json(500, {
                    message: 'Error saving car',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: car._id
            });
        });
    },

    /**
     * carController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        carModel.findOne({_id: id}, function(err, car){
            if(err) {
                return res.json(500, {
                    message: 'Error saving car',
                    error: err
                });
            }
            if(!car) {
                return res.json(404, {
                    message: 'No such car'
                });
            }

            car.carDoor =  req.body.carDoor ? req.body.carDoor : car.carDoor;			car.color =  req.body.color ? req.body.color : car.color;			
            car.save(function(err, car){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting car.'
                    });
                }
                if(!car) {
                    return res.json(404, {
                        message: 'No such car'
                    });
                }
                return res.json(car);
            });
        });
    },

    /**
     * carController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        carModel.findByIdAndRemove(id, function(err, car){
            if(err) {
                return res.json(500, {
                    message: 'Error getting car.'
                });
            }
            return res.json(car);
        });
    }
};
