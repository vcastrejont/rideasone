var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({	name: String,  provider: String,  provider_id: {type: String, unique: true},  photo: String,	email: String,  createdAt: {type: Date, default: Date.now}});

module.exports = mongoose.model('user', userSchema);
