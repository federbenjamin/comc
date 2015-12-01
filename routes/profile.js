var express = require('express');
var router = express.Router();
var session = require('express-session');  
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');

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
  },
  description: String,
  displayName: {
    type: String,
    unique: true
  },
  comic: String,
  rented: Boolean,
  rating: Number
});


var Users = mongoose.model('Users', UserSchema);
*/

router.get('/', function(req, res, next) {

  // Find the user and load their profile data
  //Users.find({username: req.session.login}, function(err, user) {
      /*
      var comic;
      if (user.comic == '') {
        comic = 'None available';
      } else {
        comic = user.comic;
      } 

      var rented;
      if (user.rented == '') {
        rented = true
      } else {
        rented = user.rented
      }

      var image;
      if (user.image == '') {
        image = '/images/logo.png';
      } else {
        image = user.image;
      }

      var name;
      if (user.displayName == '') {
        name = 'user';
      } else {
        name = user.displayNmae;
      }

      var rating;
      if (user.rating == '') {
        rating = 0;
      } else {
        rating = user.rating;
      }
      
      res.render('profile', {
                comic: comic, 
                rented: rented, 
                image: image,
                email: user.username, 
                name: name, 
                description: user.description,
                authLevel: user.level,
                rating: rating
               });

  });
  */
  if (typeof req.session.login !== 'undefined'){
    res.render('profile', { comic: "super hero", 
                rented: true, 
                image: '/profilePics/logo.png', 
                user: 'user here', 
                email: 'email', 
                name: 'name', 
                description: 'description',
                authLevel: 0,
                rating: 4
               });
  } else {
    res.redirect('/');
  }

});

router.get('/edit', function(req, res, next) {

  if (typeof req.session.login !== 'undefined'){
    res.render('edit');
  } else {
    res.redirect('/');
  }
	
});

router.post('/updateprofile', function(req, res, next) {
	console.log(req.body);
  if (typeof req.session.login !== 'undefined'){

    Users.find({username: req.session.login}, function(err, user) {

      // Change the username/email
      if (req.body.email != '') {
        user.username = req.body.email;
      }

      // Change the display name
      if (req.body.displayName != '') {
        user.displayName = req.displayName;
      }

      // Change the description
      if (req.body.description != '') {
        user.description = req.body.description;
      }

      // Save it to the DB.
      user.save(function(err) {
        if (err) {
          res.status(500).send(err);
          console.log(err);
          return;
        }
      });

    });

    res.render('edit');
  } else {
    res.redirect('/');
  }
});

router.post('/updatepwd', function(req, res, next) {
	console.log(req.body);
  if (typeof req.session.login !== 'undefined'){
    
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.render('edit', { title: 'CURD App', passnotempty: true, wrongpassword: true, newpasswordnotempty: true, matching: true });
    
    } else if (req.body.password == '') {
      res.render('edit', { title: 'CURD App', passnotempty: false, wrongpassword: false, newpasswordnotempty: true, matching: true });

    } else if (req.body.newPassword == '') {
      res.render('edit', { title: 'CURD App', passnotempty: true, wrongpassword: false, newpasswordnotempty: false, matching: true });

    } else if (!bcrypt.compareSync(req.body.newPassword, req.body.confirmPassword)) {
      res.render('edit', { title: 'CURD App', passnotempty: true, wrongpassword: false, newpasswordnotempty: true, matching: false });
    
    } else {
      user.password = req.body.newPassword;

      user.save(function(err) {
        if (err) {
          res.status(500).send(err);
          console.log(err);
          return;
        }
      });

      res.render('edit', { title: 'CURD App', passnotempty: true, wrongpassword: false, newpasswordnotempty: true, matching: true });

    }

  } else {
    res.redirect('/');
  }
});

router.post('/upload', upload.single('profilePic'), function(req, res) {

  if (typeof req.session.login !== 'undefined'){
    Users.find({username: req.session.login}, function(err, user) {    
      if (user.image != '/profilePics/logo.png') {
        fs.unlink(user.image);
      }
      
      user.image = '/profilePics/' + req.file.filename;

      res.redirect('/profile/edit');
    });
  } else {
    res.redirect('/');

  }
});

module.exports = router;