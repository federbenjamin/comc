var express = require('express');
var router = express.Router();
var session = require('express-session');  
var mongoose = require('mongoose');

/*var RentalSchema = mongoose.Schema({
	id: {
		type: Number,
		unique: true
	},
	renter: String,
	comic_id: Number,
	is_rented: Boolean,
	date_rented: Date, 
    is_returned: Boolean,
    date_returned: Date
});
*/
var Rentals = mongoose.model('Rentals');
var Users = mongoose.model('Users');

//rentals are created in addcomic when a comic is added

router.get('/editRental', function(req, res) {
    res.render('editRental', { comicid: req.body.comicid, login: req.session.login});
});

router.post('/updateRental', function(req, res) {
    Rentals.find({ 'comic_id': req.body.comicid }, function(err, rental) {
        rental.renter = req.body.renter;
        rental.is_rented = true;
        rental.date_rented = new Date();
        rental.is_returned = false;
    });
    res.redirect('/');
});

router.post('/completeRental', function(req, res) {
    Rentals.find({ 'comic_id': req.body.comicid }, function(err, rental) {
        if (req.body.status != null) {
            rental.renter = " ";
            rental.is_rented = false;
            rental.is_returned = true;
            rental.date_returned = new Date();
        }
    });
    res.redirect('/');
});

router.post('/findComic', function(req, res) {
    Rentals.find({comictitle: req.body.comicname }, function(err, rental) {
        if (rental[0].is_rented == false) {
            res.render('findComic', {
                renter: rental[0].renter,
				login: req.session.login
            });
        }
        else {
            res.render('findComic', {
                rented: true,
				login: req.session.login
            });
        }
    });
});

module.exports = router;