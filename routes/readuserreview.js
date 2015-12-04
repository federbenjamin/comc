var express = require('express');
var router = express.Router();
var session = require('express-session');  
var mongoose = require('mongoose');

var Reviews = mongoose.model('Reviews');
var Users = mongoose.model('Users');

router.post('/', function(req, res) {

	if (req.session.login !== undefined) {

		var userQuery;
		if (req.session.reviewOwner === undefined || req.session.reviewOwner == '') {
			userQuery = req.body.email;

		} else {
			userQuery = req.session.reviewOwner;

		}

		req.session.reviewOwner = '';

		var authLevel;
		Users.find({ username: req.session.login }, function(err, user) {
				authLevel = user[0].level;

		});

		Reviews.find({ username: userQuery }, function(err, reviews) {
			res.render('readuserreview', { title: "COMC", review: reviews, user: userQuery, authLevel: authLevel, currentUser: req.session.login});

		});
	} else {
		res.redirect('/');

	} 

});

router.post('/deleteReview', function(req, res) { 
  Reviews.remove({username: req.body.user, 
  				  poster: req.body.poster, 
  				  date: req.body.timestamp,
  				  comment: req.body.comment,
  				  rating: req.body.rating}, 
  				  function(err) {
    if (err) {
      res.status(500).send(err);
      console.log(err);
      return;
    }
  });
	
  req.session.profileOwner = req.body.user.username;
  res.redirect('/');

});

module.exports = router;