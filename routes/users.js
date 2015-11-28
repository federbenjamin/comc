var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var fb = require('./fb.js');

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

//Configure facebook strategy

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(user, done){
	done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: fb.appID,
    clientSecret: fb.appSecret,
    callbackURL: fb.callbackUrl
  },
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
    
		// find the user in the database based on their facebook id
		Users.findOne({ 'email' : profile.emails[0].value}, function(err, user) {
 
			// if there is an error, stop everything and return that
			// ie an error connecting to the database
			if (err)
			  return done(err);
	 
			// if the user is found, then log them in
			if (user) {
				return done(null, user); // user found, return that user
			}
			else {
				// if there is no user found with that facebook id, create them
				var fbuser = new Users({
					email: profile.emails[0].value // facebook can return multiple emails so we'll take the first
				});
	 	 
				// save our user to the database
				fbuser.save(function(err) {
					if (err) throw err;
	 
					// if successful, return the new user
					done(null, fbuser);
				});
			} 
      });
    });
  }
));

router.post('/register', function(req, res) {
	if (req.body.email == ''){
		//Return error if email is empty
		res.render('signup', { title: 'CURD App', emailnotempty: false, passnotempty: true, matching: true});
	}
	else if (req.body.password == ''){
		//Return error if password is empty
		res.render('signup', { title: 'CURD App', emailnotempty:true, passnotempty: false, matching: true});
	}
	else if (req.body.password !== req.body.repeatPassword) {
		//Return error if passwords don't match
		res.render('signup', { title: 'CURD App', emailnotempty:true, passnotempty: true,matching: false });
	}
	else {
		Users.count({}, function(err, count) {
			var authLevel = 2;
			if (count == 0) {
				authLevel = 0;
			}

			var passEncrypted = bcrypt.hashSync(req.body.password);

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
				var sess = req.session;
				sess.login = req.body.email;
				res.redirect('/');
			});
		});
	}
});

router.post('/login', function(req, res) {
	Users.find({username: req.body.email}, function(err, user) {
		if (req.body.email == ''){
			//Return error if email is empty
			res.render('index', { title: 'CURD App', emailnotempty: false, passnotempty: true, userexists: true, matching: true});
		}
		else if (req.body.password == ''){
			//Return error if password is empty
			res.render('index', { title: 'CURD App', emailnotempty:true, passnotempty: false, userexists: true, matching: true});
		}
		else if (user[0] == null){
			//Return error if user does not exist
			res.render('index', { title: 'CURD App', emailnotempty:true, passnotempty: true, userexists: false, matching: true });
		}
		else if (!bcrypt.compareSync(req.body.password, user[0].password)) {
			//Return error if passwords don't match
			res.render('index', { title: 'CURD App', emailnotempty:true, passnotempty: true, userexists: true, matching: false });
		} 
		else {
			var sess = req.session;
			sess.login = req.body.email;
			res.redirect('/');
		}
	});
});

router.get('/login/facebook', function(req, res) {
	passport.authenticate('facebook', {scope: ['email']});
});

router.get('/login/facebookcallback', function(req, res) {
	passport.authenticate('facebook', function (err, user, info){
		if (err) throw err;
		if (!user) {
			var sess = req.session;
			sess.login = req.body.email;
		}
		res.redirect('/');
	});
});
router.get('/logout', function(req, res) {
	var sess = req.session;
	sess.destroy();
	res.redirect('/');
});


module.exports = router;