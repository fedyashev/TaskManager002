let mongoose = require("mongoose");
let bcrypt = require("bcryptjs");

// let credentials = require("../credentials");
// mongoose.connect(credentials.mlab.connectionString);
// let db = mongoose.connection;

let UserSchema = mongoose.Schema({
    username : {
        type : String,
        index : true
    },
    password : {
        type : String
    },
    email : {
        type : String
    },
    name : {
        type : String
    }
});

let User = mongoose.model("User", UserSchema);

User.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

User.getUserByUsername = function(username, callback) {
    let query = {username : username};
    User.findOne(query, callback);
};

User.comparePasswords = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(error, isMatch) {
        if (error) throw error;
        callback(null, isMatch);
    });
};

User.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports = User;