var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var locationSchema = new Schema({

locationSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

locationSchema.index({location: '2dsphere'});


module.exports = mongoose.model('location', locationSchema);