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
	}
});

var Messages = mongoose.model('Messages', MessageSchema);
var Users = mongoose.model('Users');

// Get message page
router.get('/', function(req, res) {

	Messages.find({ receiver: req.session.login }, function(err, mess) {

		console.log("messages: " + mess);

		res.render('message', { message: mess, title: "COMC" });

	});
});

router.post('/writeMessage', function(req, res) {
	if (req.session.login !== undefined) {
		if (req.body.id !== undefined) {

			console.log(req.body);
			var message = '\n\n\n\n\n\n\n------------------------' + Date() + '\n\n' + req.body.message;
			var subject = 'RE:' + req.body.subject

			res.render('writeMessage', { email: req.body.sender, message: message, subject: subject });
		} else {
			res.render('writeMessage', { email: req.body.email});

		}

	} else {
		res.redirect('/');

	}

});

// Write message
router.post('/writeMessage/write', function(req, res) {

	var id = Math.floor(Math.random() * (9999999999 - 0)) + 0;
	var message = new Messages({
				id: id,
				receiver: req.body.user,
				sender: req.session.login,
				subject: req.body.subject,
				message: req.body.message
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
										msg: msg[0]
									  });

		});

	});

});

// Delete message
router.post('/delete', function(req, res) {
	console.log("ID: " + req.body.id);

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

module.exports = router;