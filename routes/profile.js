var express = require('express');
var router = express.Router();
var session = require('express-session');  
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/profilePics');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.png');
  }
})

var upload = multer({ storage: storage });

/*
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
*/
/*
var Schema = mongoose.Schema;
var Users = mongoose.model('Users', new Schema({
  level: Number,
  username: {
    type: String,
    unique: true
  },
  password: String,
  image: {
    type: String,
    required: false
  },
  description: String,
  displayName: {
    type: String,
    unique: true
  },
  comic: String,
  rented: Boolean,
  rating: Number
}), 'users');
*/
var Users = mongoose.model('Users');
var Genres = mongoose.model('Genres');

router.get('/', function(req, res, next) {

  if (typeof req.session.login !== 'undefined'){

    // Find the user and load their profile data
    Users.find({username: req.session.login}, function(err, currentUser) {

      queryUser = (req.query.username != undefined ? req.query.username : req.session.login);
      Users.find({username: queryUser}, function(err, user) {

        var rating = user[0].rating;

        // Get the current user's authority level
        var access;
        // Access for super admin
        if (currentUser[0].level == 0 && req.session.login != user[0].username) {
          access = 0;

        // Access to the user's own account
        } else if (req.session.login == user[0].username) {
          access = 3;

        // Lowest level access if the authority levels are the same
        } else if (currentUser[0].level == user[0].level) {
          access = 2;

        // Access for admins 
        } else if (currentUser[0].level == 1 && user[0].level == 2) {
          access = 1;
        }
	
		
		Genres.find({username:user[0].username}, function(err, genreusers){
			if (err) {
			  res.status(500).send(err);
			  console.log(err);
			  return;
			}
			//No genres were selected by user
			if (!genreusers.length){
				res.render('profile', {
						  image: user[0].image,
						  email: user[0].username, 
						  name: user[0].displayName, 
						  description: user[0].description,
						  authLevel: access,
						  rating: rating,
						  profileLevel: user[0].level,
						  login: req.session.login,
						  nogenre:true
				});
			}
			//Genres were selected by the user
			else{
				res.render('profile', {
						  image: user[0].image,
						  email: user[0].username, 
						  name: user[0].displayName, 
						  description: user[0].description,
						  authLevel: access,
						  rating: rating,
						  profileLevel: user[0].level,
						  login: req.session.login,
						  genres:genreusers
				});
			}
		});
      });
  
   });  
  
  } else {
    res.redirect('/');
  }

});

router.post('/edit', function(req, res, next) {

  if (typeof req.session.login !== 'undefined'){
    res.render('edit', {email: req.body.email, passnotempty: true, wrongpassword: false, newpasswordnotempty: true, matching: true, login: req.session.login});
  } else {
    res.redirect('/');
  }
	
});

router.post('/updateprofile', function(req, res, next) {

  if (typeof req.session.login !== 'undefined') {

    Users.find({username: req.body.email}, function(err, user) {

      // Change the display name
      if (req.body.displayName != '') {
        user[0].displayName = req.body.displayName;
      }

      // Change the description
      if (req.body.description != '') {
        user[0].description = req.body.description;
      }

      // Save it to the DB.
      user[0].save(function(err) {
        if (err) {
          res.status(500).send(err);
          console.log(err);
          return;
        }
      });

    });
	if (req.body.genre != null && req.body.genre.length>0){ //Only update when genre is selected
		Genres.find({username:req.body.email}).remove(function(err){
			if (err) {
			  res.status(500).send(err);
			  console.log(err);
			  return;
			}
			
			//Add each selected genre to the database
			for (i = 0; i < req.body.genre.length; i++) {
				var preference = new Genres({
					username: req.body.email,
					genre: req.body.genre[i]
				});
				preference.save(function(err) {
					if (err) {
						res.status(500).send(err);
						console.log(err);
						return;
					}
				});
			}
		});
	}
		

    res.render('edit', {email: req.body.email, passnotempty: true, wrongpassword: false, newpasswordnotempty: true, matching: true, login: req.session.login});

  } else {
    res.redirect('/');
  }
});

router.post('/updatepwd', function(req, res, next) {

  console.log(req.body);

  if (typeof req.session.login !== 'undefined'){
    
    Users.find({username: req.body.email}, function(err, user) {

      var passEncrypted1 = bcrypt.hashSync(req.body.newPassword);

      if (!bcrypt.compareSync(req.body.password, user[0].password)) {
        res.render('edit', { title: 'CURD App', email: req.body.email, passnotempty: true, wrongpassword: true, newpasswordnotempty: true, matching: true , login: req.session.login});
    
      } else if (req.body.password == '') {
        res.render('edit', { title: 'CURD App', email: req.body.email, passnotempty: false, wrongpassword: false, newpasswordnotempty: true, matching: true , login: req.session.login});

      } else if (req.body.newPassword == '') {
        res.render('edit', { title: 'CURD App', email: req.body.email, passnotempty: true, wrongpassword: false, newpasswordnotempty: false, matching: true , login: req.session.login});

      } else if (req.body.newPassword != req.body.confirmPassword) {
        res.render('edit', { title: 'CURD App', email: req.body.email, passnotempty: true, wrongpassword: false, newpasswordnotempty: true, matching: false , login: req.session.login});
    
      } else {

        user[0].password = passEncrypted1;

        user[0].save(function(err) {
          if (err) {
            res.status(500).send(err);
            console.log(err);
            return;
          }
        });

        res.render('edit', { title: 'CURD App', email: req.body.email, passnotempty: true, wrongpassword: false, newpasswordnotempty: true, matching: true, login: req.session.login });

      }
  });

  } else {
    res.redirect('/');
  }
});

router.post('/upload', upload.single('profilePic'), function(req, res) {

  if (typeof req.session.login !== 'undefined'){
    Users.find({username: req.body.email}, function(err, user) {    
      if (user[0].image != '/profilePics/logo.png') {
        fs.unlink(user[0].image);
      }
      
      user[0].image = '/profilePics/' + req.file.filename;

      res.render('edit', { title: 'CURD App', email: req.body.email, passnotempty: true, wrongpassword: false, newpasswordnotempty: true, matching: true, login: req.session.login });

    });
  } else {
    res.redirect('/');

  }
});

router.post('/deleteAccount', function(req, res) {

  Users.remove({username: req.body.email}, function(err) {
    if (err) {
      res.status(500).send(err);
      console.log(err);
      return;
    }
  });
  res.redirect('/');

});

router.post('/makeAdmin', function(req, res) {

  Users.find({username: req.body.email}, function(err, user) {
    if (user[0].level == 1) {
      user[0].level = 2;
    } else if (user[0].level == 2) {
      user[0].level = 1;
    }

    user[0].save(function(err) {
      if (err) {
        res.status(500).send(err);
        console.log(err);
        return;
      }
    });

    req.session.profileOwner = req.body.email;
    res.redirect('/profile');

  });
});

module.exports = router;