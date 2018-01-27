const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load Model
const User = mongoose.model('users');

module.exports = function(passport){
	
}