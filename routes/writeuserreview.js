var express = require('express');
var router = express.Router();
var session = require('express-session');  
var mongoose = require('mongoose');

var ReviewSchema = mongoose.Schema({
	username: String,
	reviewer: String,
	rating: Number,
	comment: String,
	date: Date
});

var Users = mongoose.model('Users');
var Reviews = mongoose.model('Reviews', ReviewSchema);

router.post('/', function(req, res) {
  if (req.session.login !== 'undefined') {
  	res.render('writeUserReview', { title: 'COMC', email: req.body.email, login: req.session.login});
  
  } else {
  	res.redirect('/');

  }
});

router.post('/submitUserReview', function(req, res) {

  if (req.session.login !== 'undefined') {
  
	if (!req.body.rating){
		res.render('writeUserReview', { title: 'COMC', email: req.body.user, login: req.session.login, norating: true});
	}
	else{
		Users.find({username: req.body.user}, function(err, user) {
		  user[0].num_ratings += 1;
		  user[0].rating = ((user[0].rating * (user[0].num_ratings -1)) + Number(req.body.rating))/(user[0].num_ratings);
		  user[0].save(function(err) {
			  if (err) {
				res.status(500).send(err);
				console.log(err);
				return;
			  }
			
			  // Create a new review
			  var review = new Reviews({
				username: req.body.user,
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
				res.redirect('/profile?username=' + user[0].username);
			  });
		  });
	});


 	}
	
  } else {
	res.redirect('/');

  }
});

module.exports = router;