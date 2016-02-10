// Dependencies
// -----------------------------------------------------
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');


//  Routes 
// ------------------------------------------------------
var mainroutes = require('./routes/mainroutes');
var locations = require('./routes/locations');
var settings = require('./routes/settings');
var events = require('./routes/events');
var rides = require('./routes/rides');
var myroutes = require('./routes/myroutes');
//  Database  
// ------------------------------------------------------
var mongoose = require('mongoose');
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DB connection succesful!");
});


// view engine setup
// ------------------------------------------------------
var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname, 'public/assets/icons', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  console.log(req.path);
  if(req.path === "/myroutes")
    res.locals.menu1 =true;
  if(req.path === "/rides")
    res.locals.menu2 =true;
  if(req.path === "/events")
    res.locals.menu3 =true;
  if(req.path === "/settings")
    res.locals.menu4 =true;
  next();
})

// Routes
// ------------------------------------------------------
app.use('/', mainroutes);
app.use('/locations', locations);
app.use('/settings', settings);
app.use('/rides', rides);
app.use('/events', events);
app.use('/myroutes', myroutes);

// error handlers
// ------------------------------------------------------
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
