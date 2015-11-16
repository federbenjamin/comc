var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var session = require('express-session');

// To connect to MongoDB's database
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

// Define Book schema
var UserSchema = mongoose.Schema({
	level: Number,
	username: {
		type: String,
		unique: true
	},
	password: String,
	image: {
		type: String,
		required: false
	}
});

// Creates the model for Books
var Users = mongoose.model('Users', UserSchema);

router.post('/register', function(req, res) {
	if (req.body.password !== req.body.repeatPassword) {
		res.render('signup', { title: 'CURD App', matching: false });
	} else {
		Users.count({}, function(err, count) {
			var authLevel = 2;
			if (count == 0) {
				authLevel = 0;
			}

			var passEncrypted = bcrypt.hashSync(req.body.password, 10);

			// Instanitate the model.
			var user = new Users({
				level: authLevel,
				username: req.body.email,
				password: passEncrypted
			});

			// Save it to the DB.
			user.save(function(err) {
				if (err) {
					res.status(500).send(err);
					console.log(err);
					return;
				}

				// If everything is OK, then we return the information in the response.
				res.redirect('/');
			});
		});
	}
});

router.post('/login', function(req, res) {
	Users.find({username: req.body.email}, function(err, user) {
		var passEncrypted = bcrypt.hashSync(req.body.password, 10);
		console.log(user);
		console.log(passEncrypted);
		if (user[0].password !== passEncrypted) {
			res.render('index', { title: 'CURD App', matching: false });
		} else {
			var sess = req.session;
			sess.login = req.body.email;
			res.redirect('/');
		}
	});
});

module.exports = router;