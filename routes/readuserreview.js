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
			if (!reviews.length){
				res.render('readuserreview', { title: "COMC", noreview:true, user: userQuery, authLevel: authLevel, currentUser: req.session.login, login: req.session.login});
			}
			else{
				res.render('readuserreview', { title: "COMC", review: reviews, user: userQuery, authLevel: authLevel, currentUser: req.session.login, login: req.session.login});
			}

		});
	} else {
		res.redirect('/');

	} 

});

router.post('/deleteReview', function(req, res) {
  //Update ratings
  Users.find({username: req.body.user}, function(err, user){
    if (err) {
      res.status(500).send(err);
      console.log(err);
      return;
    }
	
	if (user[0].num_ratings == 1) user[0].rating = 0;
	else user[0].rating =  (user[0].num_ratings*user[0].rating - Number(req.body.rating))/(user[0].num_ratings-1);
	user[0].num_ratings -= 1;
	
	user[0].save(function(err) {
	  if (err) {
		res.status(500).send(err);
		console.log(err);
		return;
	  }
	  //Update reviews
	  Reviews.remove({username: req.body.user, 
					  reviewer: req.body.reviewer, 
					  //date: req.body.timestamp,
					  comment: req.body.comment,
					  rating: req.body.rating}, 
					  function(err) {
		if (err) {
		  res.status(500).send(err);
		  console.log(err);
		  return;
		}
	  });
	});
  });

	
  req.session.profileOwner = req.body.user;
  res.redirect('/profile?username=' + req.session.profileOwner);

});

module.exports = router;