var express = require('express');
var router = express.Router();
var session = require('express-session');  
var fs = require('fs');
var path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/profilePics');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.png');
  }
})

//var upload = multer({dest: './uploads'});
var upload = multer({ storage: storage });

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

router.post('/upload', upload.single('profilePic'), function(req, res) {
	console.log(req.file);
	res.redirect('/profile/edit');
});

module.exports = router;