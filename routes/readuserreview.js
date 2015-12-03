var express = require('express');
var router = express.Router();
var session = require('express-session');  
var mongoose = require('mongoose');

var Reviews = mongoose.model('Reviews');

router.post('/', function(req, res) {

	Reviews.find({ username: req.body.email }, function(err, reviews) {

		console.log(reviews);
		res.render('readuserreview', { title: "COMC", review: reviews, user: req.body.email });

	});

});

module.exports = router;