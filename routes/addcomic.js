var express = require('express');
var router = express.Router();
var session = require('express-session');  
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');


// Define Comic schema
var ComicSchema = mongoose.Schema({
      title: String,
      author: String,
      coverimage: {
        type: String,
        default: "no-cover.jpg"
      },
      description: String,
      genre: String,
      rating: {
        type: Number, min: 0, max: 7
      },
      num_ratings: {
        type: Number,
        default: 0
      },
      owner: String
});

var RentalSchema = mongoose.Schema({
	renter: String,
	is_rented: Boolean,
	date_rented: Date, 
    is_returned: Boolean,
    date_returned: Date, 
    comictitle: String
});

// Creates the model for Comics
var Comics = mongoose.model('Comics', ComicSchema);
var Rentals = mongoose.model('Rentals', RentalSchema);


router.post('/addedcomic', function(req, res) {
	if (req.body.comicname == ''){
		res.render('addcomic');
	}
	else if (req.body.comicauthor == ''){
		res.render('addcomic');
	}
	else {
        Comics.find({$and: [{title: req.body.comictitle}, {author: req.body.comicauthor}] }, function(err, comic) {
            if (comic[0]) {
                res.redirect('/comicpage?id=' + comic[0]._id.valueOf() + '&exists=1');
            } else {
                    
                var desc = (req.body.comicdescription ? req.body.comicdescription : "No Description Available");
                var comicgenre = (req.body.comicgenre ? req.body.comicgenre : "N/A");
                // Instanitate the model.
                var comic = new Comics({
                    title: req.body.comictitle,
                    author: req.body.comicauthor,
                    description: desc,
                    genre: comicgenre,
                    rating: 0, 
                    owner: req.body.login
                });

                // Save it to the DB.
                comic.save(function(err) {
                    if (err) {
                        res.status(500).send(err);
                        console.log(err);
                        return;
                    }
                    
                    var rental = new Rentals({
                        comictitle: comic.title,
                        renter: comic.owner,
                        is_rented: false
                    });
                    
                    rental.save(function(err) {
                        if (err) {
                            res.status(500).send(err);
                            console.log(err);
                            return;
                        }
                    });
                    

                    // If everything is OK, then we return the information in the response.
                    Comics.find({$and: [{title: comic.title}, {author: comic.author}] }, function(err, comic) {
                        res.redirect('/comicpage?id=' + comic[0]._id.valueOf());
                    });
                });
            }
        });
	}
});

module.exports = router;
