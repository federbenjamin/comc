var express = require('express');
var router = express.Router();
var session = require('express-session');  
var fs = require('fs');
var path = require('path');


router.get('/reviews', function(req, res, next) {
	res.render('reviews');
});

router.get('/getcomic', function(req, res, next) {
	res.render('getcomic');
});

router.get('/reviews', function(req, res, next) {
	res.render('writereview');
});

module.exports = router;