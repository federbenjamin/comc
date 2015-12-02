var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.redirect('/');
});

module.exports = router;