var express = require('express');
var router = express.Router();
var session = require('express-session');  
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var multer = require('multer');


var Comics = mongoose.model('Comics');

// Define Listing schema
var ListingSchema = mongoose.Schema({
      username: String,
      comicid: String
});
// Creates the model for Listings
var Listings = mongoose.model('Listings', ListingSchema);


router.get('/', function(req, res, next) {
	if (!req.query.id) {
		res.redirect('/addcomic');
	} else {
		var notNewComic = !!req.query.exists;
		Comics.find({_id: req.query.id}, function(err, comic) {
			if (!comic[0]) {
				res.redirect('/addcomic');
			} else {
				res.render('comicpage', {
                    exists: notNewComic,
                    comicname: comic[0].title,
                    authorname: comic[0].author,
                    coverimage: comic[0].coverimage,
                    description: comic[0].description,
                    genre: comic[0].genre,
                    rating: comic[0].rating,
                });
			}
		});
	}
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
	var comicID = /(id=)([^&]*)/.exec(req.headers.referer)[2];
	if (!comicID) {
		res.redirect('/');
	}
    Comics.find({_id: comicID}, function(err, comic) {
		if (!!req.file) {
	        comic[0].coverimage = req.file.filename;
	        comic[0].save();
        }
        res.redirect('/comicpage?id=' + comic[0]._id.valueOf());
    });
});

router.get('/reviews', function(req, res, next) {
	res.render('reviews');
});

router.get('/reviews', function(req, res, next) {
	res.render('writereview');
});

module.exports = router;