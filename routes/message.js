var express = require('express');
var router = express.Router();
var session = require('express-session');  
var mongoose = require('mongoose');

// Create message collection
var MessageSchema = mongoose.Schema({
	id: {
		type: Number,
		unique: true
	},
	receiver: String,
	sender: String,
	subject: {
		type: String,
		default: ''
	},
	message: {
		type: String,
		default: ''
	},
	date: {
		type: Date,
		default: Date()
	},
	rentalRequest: {
		type: Boolean,
		default: false
	}
});

var Messages = mongoose.model('Messages', MessageSchema);
var Users = mongoose.model('Users');
var ComicListings = mongoose.model('Listings');

// Get message page
router.get('/', function(req, res) {

	Messages.find({ receiver: req.session.login }, function(err, mess) {

		console.log("messages: " + mess);

		res.render('message', { message: mess, title: "COMC", login: req.session.login});

	});
});

router.post('/writeMessage', function(req, res) {
	console.log((req.body));

	if (req.session.login !== undefined) {
		if (req.body.id !== undefined) {
			var message = '\n\n\n\n\n\n\n------------------------' + Date() + '\n\n' + req.body.message;
			var subject = 'RE:' + req.body.subject

			if (req.body.renting == 'yes') {
				rentalRequest = true;

			} else {
				rentalRequest = false;
				
			}

			res.render('writeMessage', { email: req.body.sender, message: message, subject: subject, rentRequest: rentalRequest });

		} else {
			if (req.body.renting == 'yes') {
				rentalRequest = true;

			} else {
				rentalRequest = false;

			}
			console.log("rent? " + rentalRequest);

			res.render('writeMessage', { email: req.body.email, subject: req.body.subject, rentRequest: "true" });

		}
	} else {
		res.redirect('/');

	}

});

// Write message
router.post('/writeMessage/write', function(req, res) {
	console.log("rent: " + req.body.rentalRequest);

	var rentalRequest = false;
	if (req.body.rentalRequest == 'true') {
		rentalRequest = true;

	}

	var id = Math.floor(Math.random() * (9999999999 - 0)) + 0;
	var message = new Messages({
				id: id,
				receiver: req.body.user,
				sender: req.session.login,
				subject: req.body.subject,
				message: req.body.message,
				rentalRequest: rentalRequest
	});

	message.save(function(err) {
	    if (err) {
	    	res.status(500).send(err);
	      	console.log(err);
	      	return;
	    }

  	});

  	res.redirect('/message');

});

// Read message
router.post('/read', function(req, res) {

	console.log(req.body.sender);
	
	Messages.find({ id: req.body.id }, function(err, msg) {
		Users.find({ username: msg[0].sender }, function(err, user) {

			console.log(msg);
			res.render('readMessage', { email: user[0].username, 
										name: user[0].displayName, 
										image: user[0].image, 
										msg: msg[0],
										login: req.session.login
									  });
		});
	});
});

// Delete message
router.post('/delete', function(req, res) {
	Messages.find({ id: req.body.id }, function(err, msg) {
		console.log(msg);

	});

	Messages.remove({ id: req.body.id }, function(err) {    
		if (err) {
      		res.status(500).send(err);
      		console.log(err);
      		return;
    	}
    });

	var back=req.header('Referer') || '/';
	res.redirect(back);
});

router.post('/rent', function(req, res) {
	ComicListings.find({ owner: req.body.receiver }, function(err, listing) {

		if (req.body.renting == 'yes') {
			listings.is_rented = true;
			listings.renter = req.body.renter;

		} else if (req.body.renting == 'no') {


		} else if (req.body.returned == 'yes') {
			listings.is_rented = false;
			listings.renter = '';

		}

	});

})

module.exports = router;