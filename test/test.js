var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
var mongoose = require('mongoose');
//var profile = require('./routes/profile');

chai.use(chaiHttp);

describe('API Tests', function() {

  	before(function() {
    	mongoose.connect('mongodb://localhost:27017/', {
			user: '',
			pass: ''
		});

  	});

  	after(function() {
    	mongoose.connection.close();
  	});

	describe('profile', function() {
		it('should return correct profile username', function(done) {
			chai.request(server)
    			.get('/index');
      			done();
		})
	})
});