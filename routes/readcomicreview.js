var express = require('express');
var router = express.Router();
var session = require('express-session');  
var mongoose = require('mongoose');

var ComicReviews = mongoose.model('ComicReviews');
//var Comics = mongoose.model('Comics');
/*
router.post('/', function(req, res) {
    Comics.find({ id: req.body.comicid }, function(err, comic) {
        ComicReviews.find({ comicid: req.body.comicid }, function(err, review) {
            res.render('readcomicreview', { 
                title: "COMC", 
                reviewer: review.reviewer, 
                comicname: comic.name, 
                comment: review.comment, 
                date: review.reviewDate,
                rating: review.rating
            });
        });
	});

});
*/
module.exports = router;