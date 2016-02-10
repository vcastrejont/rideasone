var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var settingSchema = new Schema({	"business_name" : String,	"logo" : String,	"url" : String});

module.exports = mongoose.model('setting', settingSchema);
