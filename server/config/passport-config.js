const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = (passport) => {
  passport.use(new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(error, user) {
      if (error) throw error;
      if (!user) {
        return done(null, false, {message : "User not found."});
      }
      User.comparePasswords(password, user.password, function(error, isMatch) {
        if (error) throw error;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message : "Incorrect password."});
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
    
  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });
};