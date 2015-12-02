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

router.get('/', function(req, res, next) {

  if (typeof req.session.login !== 'undefined'){

    // Find the user and load their profile data
    Users.find({username: req.session.login}, function(err, currentUser) {

      console.log(req.session.profileOwner);
      var queryUser;
      if (req.session.profileOwner === undefined || req.session.profileOwner != '') {
        queryUser = req.session.login;
      } else {
        /***********Change this query for different profiles (other than your own)******************/
        queryUser = req.session.profileOwner;
      }
      console.log(queryUser);

      Users.find({username: queryUser}, function(err, user) {

        var comic;
        if (user[0].comic === undefined || user[0].comic == '') {
          comic = 'None available';
        } else {
          comic = user[0].comic;
        } 

        var rented;
        if (user[0].comic === undefined || user[0].rented == '' ) {
          rented = true
        } else {
          rented = user[0].rented
        }

        var image;
        if (user[0].comic === undefined || user[0].image == '' ) {
          image = '/images/logo.png';
        } else {
          image = user[0].image;
        }

        var name;
        if (user[0].comic === undefined || user[0].displayName == '') {
          name = 'user';
        } else {
          name = user[0].displayNmae;
        }

        var rating;
        if (user[0].comic === undefined || user[0].rating == '') {
          rating = 0;
        } else {
          rating = user[0].rating;
        }

        // Get the current user's authority level
        var access;
        // Access for super admin
        if (currentUser[0].level == 0 && req.session.login != user[0].username) {
          access = 0;

        // Access to the user's own account
        } else if (req.session.login == user[0].username) {
          access = 3;

        // Lowest level access if the authority levels are the same
        } else if (currentUser[0].level == user[0].level && req.session.login != user[0].username) {
          access = 2;

        // Access for admins 
        } else if (currentUser[0].level == 1 && user[0].level == 2) {
          access = 1;

        }

        var description;
        if (description === undefined) {
          description = '';
        }
      
        req.session.profileOwner = '';

        res.render('profile', {
                  comic: comic, 
                  rented: rented, 
                  image: image,
                  email: user[0].username, 
                  name: name, 
                  description: description,
                  //authLevel: access,
                  authLevel: 0,
                  rating: rating,
                  profileLevel: user[0].level
               });

      });
  
   });  
  
  } else {
    res.redirect('/');

  }

});

router.post('/edit', function(req, res, next) {

  if (typeof req.session.login !== 'undefined'){
    res.render('edit', {email: req.body.email, passnotempty: true, wrongpassword: false, newpasswordnotempty: true, matching: true});
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

    res.render('edit', {email: req.body.email, passnotempty: true, wrongpassword: false, newpasswordnotempty: true, matching: true});

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
        res.render('edit', { title: 'CURD App', email: req.body.email, passnotempty: true, wrongpassword: true, newpasswordnotempty: true, matching: true });
    
      } else if (req.body.password == '') {
        res.render('edit', { title: 'CURD App', email: req.body.email, passnotempty: false, wrongpassword: false, newpasswordnotempty: true, matching: true });

      } else if (req.body.newPassword == '') {
        res.render('edit', { title: 'CURD App', email: req.body.email, passnotempty: true, wrongpassword: false, newpasswordnotempty: false, matching: true });

      } else if (req.body.newPassword != req.body.confirmPassword) {
        res.render('edit', { title: 'CURD App', email: req.body.email, passnotempty: true, wrongpassword: false, newpasswordnotempty: true, matching: false });
    
      } else {

        user[0].password = passEncrypted1;

        user[0].save(function(err) {
          if (err) {
            res.status(500).send(err);
            console.log(err);
            return;
          }
        });

        res.render('edit', { title: 'CURD App', email: req.body.email, passnotempty: true, wrongpassword: false, newpasswordnotempty: true, matching: true });

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

      res.render('edit', { title: 'CURD App', email: req.body.email, passnotempty: true, wrongpassword: false, newpasswordnotempty: true, matching: true });

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