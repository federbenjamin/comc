var express = require('express');
var router = express.Router();
var session = require('express-session');  
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');

mongoose.connect('mongodb://localhost:27017/', {
  user: '',
  pass: ''
});


// Check the status of this connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connected to MongoDB');
});

var Users = mongoose.model('Users');

router.post('/addedcomic', function(req, res) {
	if (req.body.comicname == ''){
		res.render('addcomic');
	}
	else if (req.body.comicdescription == ''){
		res.render('addcomic');
	}
    
	else {
        Users.find({username: req.body.login}, function(err, user) {
            user[0].comic.name = req.body.comicname;
            user[0].comic.description = req.body.comicdescription;
            user[0].save();
            res.render('comicpage', {
                description: user[0].comic.description, 
                comicname: user[0].comic.name, 
                username: user[0].username, 
                covertitle: user[0].comic.covertitle
            });
        });
	}
});

router.get('/comicpage', function(req, res) {
    res.render('comicpage');
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/comicPics');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.png');
  }
});

var upload = multer({ storage: storage });

router.post('/upload', upload.single('comiccover'), function(req, res) {
    Users.find({username: req.body.login}, function(err, user) {
        user[0].comic.covertitle = req.file.filename;
        user[0].save();
        res.render('addcomic', {
            covertitle: user[0].comic.covertitle,
            login: req.body.login
        }); 
    }); 
});


module.exports = router;
