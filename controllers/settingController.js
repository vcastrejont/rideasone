var settingModel = require('../models/settingModel.js');

/**
 * settingController.js
 *
 * @description :: Server-side logic for managing settings.
 */
module.exports = {

    /**
     * settingController.list()
     */
    list: function(req, res) {
        settingModel.findOne(function(err, settings){
            if(err) {
                return res.json(500, {
                    message: 'Error getting settings.'
                });
            }
            //console.log(settings);
            return settings;
        });
    },

    /**
     * settingController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        settingModel.findOne({_id: id}, function(err, setting){
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
    },

    /**
     * settingController.create()
     */
    create: function(req, res) {
        var setting = new settingModel({
        });

        setting.save(function(err, setting){
            if(err) {
                return res.json(500, {
                    message: 'Error saving setting',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: setting._id
            });
        });
    },

    /**
     * settingController.update()
     */
    update: function(req, res) {
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

            setting.name =  req.body.name ? req.body.name : setting.name;
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
    },

    /**
     * settingController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        settingModel.findByIdAndRemove(id, function(err, setting){
            if(err) {
                return res.json(500, {
                    message: 'Error getting setting.'
                });
            }
            return res.json(setting);
        });
    }
};