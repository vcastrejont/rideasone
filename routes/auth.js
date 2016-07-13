var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');
var authController = require('../controllers/authController');

/**
* @api {post} /auth/google Authenticate with Google
* @apiName PostGoogleIdToken
* @apiGroup Authentication
* @apiParam {String}   id_token                 id_token from Google
* @apiSuccess {String}   token    JWT token to include in the Authorization HTTP Header
*/
router.post('/google', authController.PostGoogleAuth);


/**
* @api {get} /auth/me My profile
* @apiName GetMyProfile
* @apiGroup Authentication
* @apiSuccess {String}   _id    User id
* @apiSuccess {String}   name   Full name
* @apiSuccess {String}   email  Email address
* @apiSuccess {String}   photo  Picture url
* @apiHeader (JWT token) {String} Authorization
*/
router.get('/me', auth.hasToken, authController.GetProfile);

module.exports = router;