var express = require('express');
var router = express.Router();
var session = require('express-session');  
var mongoose = require('mongoose');

var ReviewSchema = mongoose.Schema({
	username: String,
	poster: String,
	comment: String
});

var Users = mongoose.model('Users');
var Reviews = mongoose.model('Reviews', ReviewSchema);

router.post('/', function(req, res) {
  if (req.session.login !== 'undefined') {
  	res.render('writeUserReview', { title: 'COMC', email: req.body.email });
  
  } else {
  	res.redirect('/');

  }
});

router.post('/submitUserReview', function(req, res) {

  if (req.session.login !== 'undefined') {
	Users.find({username: req.body.user}, function(err, user) {
  	  user.rating = req.body.rating;

  	  // Create a new review
	  var review = new Reviews({
	    username: req.body.user,
	    poster: req.session.login,
	    comment: req.body.comment
	  });

	  review.save(function(err) {
	    if (err) {
	      res.status(500).send(err);
	      console.log(err);
	      return;
	    }

  	  });

	  req.session.profileOwner = req.body.user;
	  res.redirect('/profile');

 	});
	
  } else {
	res.redirect('/');

  }
});

module.exports = router;