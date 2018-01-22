var express = require("express");
var router = express.Router();
var auth = require("../controllers/auth");

router.get("/login", auth.get_login);
router.get("/register", auth.get_register);
router.get("/logout", auth.get_logout);

router.post("/register", auth.post_register);

module.exports = router;