var firebase = require("firebase");
var config = require("../config/config");

var app = firebase.initializeApp(config.firebase);

var fdb = firebase.database();

exports.fdb = fdb;
var notifications = fdb.ref('notifications');

