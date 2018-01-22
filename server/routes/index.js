var express = require('express');
var router = express.Router();
var index = require("../controllers/index");

/* GET home page. */
router.get('/', ensureAuthenticated, index.get);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        req.flash("error_msg", "You are not logged in.");
        res.redirect("/auth/login");
    }
}

module.exports = router;
