// Dependencies
// -----------------------------------------------------
var express   = require('express');
var path      = require('path');
var favicon   = require('serve-favicon');
var logger    = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config    = require('./config/config');
var api       = require('./routes/api');
var passport  = require('passport');
var session   = require('express-session');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/routes');

require('./controllers/passport')(passport);
//  Database
// ------------------------------------------------------
var mongoose = require('mongoose');
mongoose.connect(config.database_labs);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DB connection succesful!");
});


// Express
// ------------------------------------------------------
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public/assets/icons', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "secret nscarpooling",
    store: new MongoStore({
       mongooseConnection:  mongoose.connection})
  }));
app.use(passport.initialize());
app.use(passport.session());


// Routes
// ------------------------------------------------------
app.use('/', routes);
app.use('/api', api);
app.get('/auth/google', passport.authenticate('google',{ scope: [ 'email','profile']}));
app.get('/auth/google/callback', passport.authenticate('google',{ successRedirect: '/', failureRedirect: '/login' }));

// error handlers
// ------------------------------------------------------
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


module.exports = app;
