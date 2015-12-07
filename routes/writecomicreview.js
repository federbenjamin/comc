var express = require('express');
var router = express.Router();
var session = require('express-session');  
var mongoose = require('mongoose');

var ComicReviewSchema = mongoose.Schema({
	comicid: String,
	reviewer: String,
	comment: String, 
    rating: Number, 
    reviewDate: Date
});

var Comics = mongoose.model('Comics');
var Users = mongoose.model('Users');
var ComicReviews = mongoose.model('ComicReviews', ComicReviewSchema);

router.post('/', function(req, res) {
  if (req.session.login !== 'undefined') {
  	res.render('writeComicReview', { title: 'COMC', comicid: req.body.comicid, comicname: req.body.comicname, comicowner: req.body.comicowner, login: req.session.login});
  } else {
  	res.redirect('/');
  }
});

router.post('/submitComicReview', function(req, res) {
  if (req.session.login !== 'undefined') {
  
	if (!req.body.rating){
		res.render('writeComicReview', { title: 'COMC', comicid: req.body.comicid, comicname: req.body.comicname, login: req.session.login, norating: true});
	}
	else{
		Comics.find({_id: req.body.comicid}, function(err, comic) {
		  comic[0].num_ratings += 1;
		  comic[0].rating = ((comic[0].rating * (comic[0].num_ratings -1)) + Number(req.body.rating))/(comic[0].num_ratings);
		  comic[0].save(function(err) {
		  // Create a new review
			  var review = new ComicReviews({
				comicid: req.body.comicid,
				reviewer: req.session.login,
				comment: req.body.comment, 
				rating: req.body.rating,
				date: new Date()
			  });

			  review.save(function(err) {
				if (err) {
				  res.status(500).send(err);
				  console.log(err);
				  return;
				}

			  });

			  req.session.profileOwner = req.body.user;
			  res.redirect('/comicpage?id=' + req.body.comicid);
		  });
		});
	  } 
	}else {
		res.redirect('/');

	  }
});

module.exports = router;