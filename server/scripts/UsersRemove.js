var mongoose = require("mongoose");
var User = require("../models/user");
var credentials = require("../credentials");

mongoose.connect(credentials.mlab.connectionString);

User.find().remove().exec(function(error, result) {
    if (error) throw error;
    console.log(result);
});

User.find(function(error, users) {
    if (error) throw error;
    console.log(users.length);
});