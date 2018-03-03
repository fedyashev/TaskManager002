var express = require("express");
var router = express.Router();
var task = require("../controllers/task");

router.get("/", task.get);

router.get("/:id", task.getId);
router.post("/:id", task.postId);
router.delete("/:id", task.deleteId);

router.put("/:id/setStatusActive", task.putSetStatusActive);
router.put("/:id/setStatusSuccess", task.putSetStatusActive);
router.put("/:id/setStatusFail", task.putSetStatusActive);

router.get("/list", task.getList);

router.get("/create", task.getCreateTask);
router.post("/create", task.postCreateTask);

module.exports = router;