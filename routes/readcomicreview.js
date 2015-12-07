var express = require('express');
var router = express.Router();
var session = require('express-session');  
var mongoose = require('mongoose');

var ComicReviews = mongoose.model('ComicReviews');
var Comics = mongoose.model('Comics');
var Users = mongoose.model('Users');

router.post('/', function(req, res) {
	if (req.session.login !== undefined){
		Comics.find({_id: req.body.comicid}, function(err,comic){
			ComicReviews.find({ comicid: req.body.comicid }, function(err, reviews) {
				var authLevel;
				Users.find({ username: req.session.login }, function(err, user) {
						authLevel = user[0].level;
				});
		
				if (!reviews.length){
					res.render('readcomicreview', { 
						title: "COMC", 
						login: req.session.login,
						noreview:true,
						comicname:comic[0].title,
						comicid: req.body.comicid,
						currentUser: req.session.login
					});
				}
				else{
					res.render('readcomicreview', { 
						title: "COMC", 
						login: req.session.login,
						review:reviews,
						comicname:comic[0].title,
						comicid: req.body.comicid,
						currentUser: req.session.login
					});
				}
			});
		});
	}
	else{
		res.redirect('/');
	}
});

router.post('/deleteReview', function(req, res) {
  //Update ratings
  Comics.find({_id: req.body.comicid}, function(err, comic){
    if (err) {
      res.status(500).send(err);
      console.log(err);
      return;
    }
	
	if (comic[0].num_ratings == 1) comic[0].rating = 0;
	else comic[0].rating =  (comic[0].num_ratings*comic[0].rating - Number(req.body.rating))/(comic[0].num_ratings-1);
	comic[0].num_ratings -= 1;
	
	comic[0].save(function(err) {
	  if (err) {
		res.status(500).send(err);
		console.log(err);
		return;
	  }
	  //Update reviews
	  ComicReviews.remove({comicid: req.body.comicid, 
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

  res.redirect('/comicpage?id=' + req.body.comicid);

});

module.exports = router;