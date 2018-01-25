var mongoose = require("mongoose");
var Task = require("../models/task");
var credentials = require("../credentials");

mongoose.connect(credentials.mlab.connectionString);

Task.find().remove().exec(function(error, result) {
    if (error) throw error;
    console.log(result);
});

Task.find(function(error, tasks) {
    if (error) throw error;
    console.log(tasks.length);
});