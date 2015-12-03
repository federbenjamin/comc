var express = require('express');
var router = express.Router();
var session = require('express-session');  
var mongoose = require('mongoose');

var ComicReviewSchema = mongoose.Schema({
	comicname: String,
	poster: String,
	comment: String
});

var Users = mongoose.model('Users');
var ComicReviews = mongoose.model('ComicReviews', ComicReviewSchema);

router.post('/', function(req, res) {
  if (req.session.login !== 'undefined') {
  	res.render('writeComicReview', { title: 'COMC', comicname: req.body.comicname, comicowner: req.body.comicowner});
  
  } else {
  	res.redirect('/');

  }
});

router.post('/submitComicReview', function(req, res) {

  if (req.session.login !== 'undefined') {
	Users.find({username: req.body.comicowner}, function(err, user) {
  	  user[0].comic.rating = req.body.rating;

  	  // Create a new review
	  var review = new ComicReviews({
	    comicname: req.body.comicname,
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