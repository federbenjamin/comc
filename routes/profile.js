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

module.exports = router;