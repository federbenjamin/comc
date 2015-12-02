var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var router = express.Router();

router.post('/', function(req, res, next) {
	//Check which radio button was pressed
	//If user, search by email or by display name
	//If comic, search by name or description
	res.render('search');
});

module.exports = router;