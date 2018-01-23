var express = require('express');
var router = express.Router();
var index = require("../controllers/index");
var middleware = require("../middleware/index");

/* GET home page. */
router.get('/', middleware.ensureAuthenticated, index.get);

module.exports = router;
