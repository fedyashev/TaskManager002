var controller = {};

controller.getList = function(req, res) {
  res.render("task_list");
};

controller.getCreateTask = function(req, res) {
  res.render("task_create");
};

controller.postCreateTask = function(req, res) {

}

module.exports = controller;