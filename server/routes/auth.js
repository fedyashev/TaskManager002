const express = require("express");
const passport = require("passport");
const router = express.Router();
const auth = require("../controllers/auth");

router.get("/login", auth.get_login);
router.get("/register", auth.get_register);
router.get("/logout", auth.get_logout);

router.post("/register", auth.post_register);
router.post("/login", passport.authenticate("local", {successRedirect : "/", failureRedirect : "login", failureFlash : true}), auth.post_login);

module.exports = router;