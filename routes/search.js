var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');

var Users = mongoose.model('Users');
var Comics = mongoose.model('Comics');
var Genres = mongoose.model('Genres');

//Case when user tries to access user page without searching
router.get('/', function(req, res, next) {
	if (req.session.login) {
		res.render('search', {nosearch: true});
	}
	else{
		res.redirect('/');
	}
});

router.post('/', function(req, res, next) {
	if (req.session.login) {
		//Check which radio button was pressed
		//If user, search by email or by display name
		if (req.body.searchtype == 'user'){
			Users.find(
				//Find users based on email or displayname
				{$or: [{username: new RegExp('.*'+req.body.search+'.*', "i")}, {displayName: new RegExp('.*'+req.body.search+'.*', "i")}]},
				'username displayName',
				{sort: {rating: -1}},
				//{username: new RegExp('.*'+req.body.search+'.*', "i")},
				function(err, users){
					if (err) {
						res.status(500).send(err);
						console.log(err);
						return;
					}
					if (users.length == 0) res.render('search', {title: 'COMC', exists: false, searchtype: 'user', searched:req.body.search, login: req.session.login});
					else res.render('search', {exists: true, searchtype: 'user', data: users, searched:req.body.search, login: req.session.login});
				}
			);
		}
		//If comic, search by name, genre or description
		else if (req.body.searchtype == 'comic'){
			Genres.find({username: req.session.login}, function(err, user){
				
				if (err) {
				  res.status(500).send(err);
				  console.log(err);
				  return;
				}
				
				//When user has selected genre
				var genrearray = [];
				if (user.length > 0){
					for (i = 0; i < user.length; i++){
						genrearray.push(user[i].genre);
					}
				}
				
				var query = Comics.find({genre: {$in: genrearray}});
				var preferredcomics = [];
				query.sort({rating: -1}).exec(function(err, comics){
					if (err) {
					  res.status(500).send(err);
					  console.log(err);
					  return;
					}
					preferredcomics = comics;
				});
				
				Comics.find(
					//Find comics based on title, description or genre
					{
					$and:[
						{$or: [
							{title: new RegExp('.*'+req.body.search+'.*', "i")}, 
							{author: new RegExp('.*'+req.body.search+'.*', "i")}, 
							{description: new RegExp('.*'+req.body.search+'.*', "i")}, 
							{genre: new RegExp('.*'+req.body.search+'.*', "i")}
						]},
						{
							genre: {$not: {$in:genrearray}}
						}				
					]},
					'_id title author genre',
					{sort: {rating: -1}},
					function(err, nonpreferredcomics){
						if (err) {
							res.status(500).send(err);
							console.log(err);
							return;
						}
						
						newcomics = preferredcomics.concat(nonpreferredcomics);
						
						if (newcomics.length == 0) res.render('search', {title: 'COMC', exists: false, searchtype: 'comic', searched:req.body.search, login: req.session.login});
						else res.render('search', {exists: true, searchtype: 'comic', data: newcomics, searched:req.body.search, login: req.session.login});
					}
				);
			});
		};
	}
	else{
		res.redirect('/');
	}
});

module.exports = router;