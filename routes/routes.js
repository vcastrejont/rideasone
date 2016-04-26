var express = require('express');
var router = express.Router();

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}

router.get('/', isLoggedIn, function(req, res, next) {
	// res.append('X-My-Custom-Header', 'Custom');
	res.render('index.ejs', {user : req.user});
});
router.get('/login',  function(req, res) {
		res.render('login.ejs');
});
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
