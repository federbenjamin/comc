var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
	var username = false;
	var sess = req.session;
	if (sess.login) {
		res.redirect('homepage');
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
