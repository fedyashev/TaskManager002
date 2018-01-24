var express = require("express");
var router = express.Router();
var task = require("../controllers/task");

router.get("/list", task.getList);

router.get("/create", task.getCreateTask);
router.post("/create", task.postCreateTask);

module.exports = router;