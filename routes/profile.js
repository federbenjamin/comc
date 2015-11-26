var express = require('express');
var router = express.Router();
var session = require('express-session');
	
router.get('/profile', function(req, res, next) {
	res.render('profile', { comic: "super hero", 
						    rented: "Yes", 
						    disable: false, 
						    image: "/images/logo.png", 
						    user: 'user here', 
						    email: 'email', 
						    name: 'name', 
						    description: 'description'
						   });
});

router.get('/edit', function(req, res, next) {
	res.render('edit');
});

router.post('/updateprofile', function(req, res, next) {
	console.log(req.body);
});

router.post('/updatepwd', function(req, res, next) {
	console.log(req.body);
});

router.post('/upload', function(req, res, next) {
	console.log(req.files);
	//res.render('edit', {image: req.body.profilePic})
});

module.exports = router;