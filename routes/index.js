var express = require('express');
var router = express.Router();
var session = require('express-session');

//var Comics = mongoose.model('Comics');
//var Genres = mongoose.model('Genres');

/* GET home page. */
router.get('/', function(req, res, next) {
	var username = false;
	var sess = req.session;
	if (sess.login) {
		username = sess.login;
		console.log(sess.login);
		/*
		//Render homepage, including recommendations based on user's favourite genres
		Genres.find({username: sess.login}, function(err,user){
			if (err) {
			  res.status(500).send(err);
			  console.log(err);
			  return;
			}
			
			//When user has selected genre
			if (user.length > 0){ 
				var query = Comics.find();
				for (i = 0; i < user.length.i++){
					query.or([{genre: user[i].genre}]);
				}
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
		*/
		res.render('homepage', { title: 'COMC', matching: true, login: username}); // Remove later
	}
	else{
		res.render('index', { title: 'COMC', emailnotempty:true, passnotempty: true, userexists: true, matching: true, login: username});
	}
});

router.get('/signup', function(req, res, next) {
	res.render('signup', { title: 'COMC', matching: true, emailnotempty:true, passnotempty:true});
});

router.get('/addcomic', function(req, res, next) {
    var login = false;
    var sess = req.session;
	if (typeof req.session.login !== 'undefined'){
        login = sess.login;
        res.render('addcomic', {login: login});
    } 
    else {
        res.redirect('/');
    }
});

module.exports = router;
