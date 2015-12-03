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
            console.log(req.body.comicdescription);
            user[0].comic.name = req.body.comicname;
            user[0].comic.description = req.body.comicdescription;
            res.render('comicpage', {
                description: user[0].comic.description, 
                comicname: user[0].comic.name
            });
        });
	}
});

router.get('/comicpage', function(req, res) {
    res.render('comicpage');
});

//var upload = multer({dest: './uploads'});
/*
router.get('/success', function(req,res) {
      res.render('comicpage');
});

router.post('/api/photo', upload.array('photos', 12), function(req,res){
    console.log("here");
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/comicPics');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.png');
  }
});

var upload = multer({ storage: storage });

*/


module.exports = router;
