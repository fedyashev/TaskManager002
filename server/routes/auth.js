var express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var router = express.Router();
var auth = require("../controllers/auth");
var User = require("../models/user");

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
            }
            else {
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

router.get("/login", auth.get_login);
router.get("/register", auth.get_register);
router.get("/logout", auth.get_logout);

router.post("/register", auth.post_register);
router.post("/login", passport.authenticate("local", {successRedirect : "/", failureRedirect : "/auth/login", failureFlash : true}), auth.post_login);

module.exports = router;