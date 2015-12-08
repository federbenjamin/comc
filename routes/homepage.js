var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');

var Comics = mongoose.model('Comics');
var Genres = mongoose.model('Genres');

router.get('/', function(req, res, next) {
	var username = false;
	var sess = req.session;
	if (sess.login) {
		username = sess.login;
		//Render homepage, including recommendations based on user's favourite genres
		Genres.find({username: sess.login}, function(err,user){
			if (err) {
			  res.status(500).send(err);
			  console.log(err);
			  return;
			}
			
			//When user has selected genre
			if (user.length > 0){ 
				var genrearray = [];
				for (i = 0; i < user.length; i++){
					genrearray.push(user[i].genre);
				}
				
				var query = Comics.find({genre: {$in: genrearray}});
				
				query.limit(10).sort({rating: -1}).exec(function(err, comics){
					if (err) {
					  res.status(500).send(err);
					  console.log(err);
					  return;
					}
					
					var length = 10;
					if (comics.length < 10) length = comics.length;
					if (comics.length == 0){
						res.render('homepage', { title: 'COMC', matching: true, login: username, recommendation: true, length: length});
					}
					else{
						res.render('homepage', { title: 'COMC', matching: true, login: username, recommendation: comics, length: length});
					}
				});
			}
			// When user has selected no genres
			else{
				res.render('homepage', { title: 'COMC', matching: true, login: username});
			}
		});
	}
	else{
		res.redirect('/');
	}
});

module.exports = router;