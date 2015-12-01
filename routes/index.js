var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
	var username = false;
	var sess = req.session;
	if (sess.login) {
		username = sess.login;
		console.log(sess.login);
		//Render homepage, including recommendations based on user's favourite genres
		res.render('homepage', { title: 'CURD App', matching: true, login: username});
	}
	else{
		res.render('index', { title: 'CURD App', emailnotempty:true, passnotempty: true, userexists: true, matching: true, login: username});
	}
});

router.get('/signup', function(req, res, next) {
	res.render('signup', { title: 'CURD App', matching: true, emailnotempty:true, passnotempty:true});
});

module.exports = router;
