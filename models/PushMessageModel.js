var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Status = ["PENDING", "SENT", "ERROR"];

var PushMessageModel = new Schema({

module.exports = mongoose.model('PushMessageModel', PushMessageModel);