var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var locationSchema = new Schema({		name 					:  {type: String, required: true},		location			:  {type: [Number], required: true}, // [Long, Lat]		address 			:  {type: String},		url 					:  {type: String},		phone 				:  {type: String},		place_id 			:  {type: String},		place_url 		:  {type: String},		company_place :  {type: Boolean},		events 				:  [											{ 											name: String,											organizer: String,											organizer_id: String,											description:String,											datetime: Date,											category: String,										 	}										],		tags					: {type: [String], required: false},										created_at		: {type: Date, default: Date.now},		updated_at		: {type: Date, default: Date.now}});

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
