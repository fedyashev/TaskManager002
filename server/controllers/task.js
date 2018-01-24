var Task = require("../models/task");

module.exports.getList = function(req, res) {
  Task.getRootTask(req.user, function(error, task) {
    if (error) throw error;
    if (!task) throw new Error("Can't find a root task.");
    let context = task;
    context.isRootTask = true;
    res.render("task/read", context);
  });
};

module.exports.getCreateTask = function(req, res) {
  res.render("task/create");
};

module.exports.postCreateTask = function(req, res) {
  Task.getRootTask(req.user, function(error, rootTask) {
    let newTask = new Task({
      userId : req.user,
      parentTask : rootTask._id,
      name : req.body.name,
      description : req.body.description
    });
    Task.createTask(newTask, function(error, task) {
      if (error) throw error;
      Task.appendChildTask(rootTask, task, (p, q) => {console.log(q)});
      console.log("Task was created.");
      console.log(task);
      let context = task;
      context.isRootTask = true;
      res.redirect("/task/list");
    });
  });
};