var express = require('express');
var multer = require('multer');
var app = express();
var upload = multer({ dest: './uploads/comicPics/'});
var fs = require('fs');
var path = require('path');
var router = express.Router();

//var upload = multer({dest: './uploads'});

router.get('/success', function(req,res) {
      res.render('comicpage');
});

router.post('/api/photo', upload.array('photos', 12), function(req,res){
    console.log("here");
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/comicPics');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.png');
  }
});

var upload = multer({ storage: storage });


module.exports = router;