var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

router.get('/addcomic', function(req, res, next) {
	res.render('addcomic');
});

module.exports = router;