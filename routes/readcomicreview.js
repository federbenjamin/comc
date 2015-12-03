var express = require('express');
var router = express.Router();
var session = require('express-session');  
var mongoose = require('mongoose');

var ComicReviews = mongoose.model('ComicReviews');

router.post('/', function(req, res) {

	ComicReviews.find({ comicname: req.body.comicname }, function(err, reviews) {

		console.log(reviews);
		res.render('readcomicreview', { title: "COMC", review: reviews, user: req.body.comicname });

	});

});

module.exports = router;