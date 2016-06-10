var express = require('express');
var router = express.Router();

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}
  
router.get('/', function(req, res, next) {
	if (req.isAuthenticated()){
		res.render('app.ejs', {user : req.user});
	}else{
		res.render('landing.ejs');
	}
	
});

router.get('/app', isLoggedIn, function(req, res, next) {
	res.render('app.ejs', {user : req.user});
});

router.get('/login',  function(req, res) {
		res.render('login.ejs');
});
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
