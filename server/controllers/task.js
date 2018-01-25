var Task = require("../models/task");
var url = require("url");
// var Schema = require("mongoose").Schema;

module.exports.get = function(req, res) {
  Task.getRootTask(req.user, function(error, task) {
    if (error) throw error;
    res.redirect(`task/${task._id}`);
  });
};

module.exports.getId = function(req, res) {
  let taskId = url.parse(req.url).path.slice(1);
  Task.getTaskById(taskId, function(error, task) {
    if (error) throw error;
    if (task && (req.user._id.toString() === task.userId.toString())) {
      task.populate("childTasks").exec(function(error, task) {
        res.render("task/task", task);
      });
    }
    else {
      res.status(404).render("errors/404", {message : "Task not found."});  
    }
  });
};

module.exports.postId = function(req, res) {
  let taskId = url.parse(req.url).path.slice(1);
  Task.getTaskById(taskId, function(error, task) {
    if (error) throw error;
    if (task && (req.user._id.toString() === task.userId.toString())) {
      let newTask = new Task({
        userId : req.user._id,
        parentTask : task._id,
        name : req.body.name
      });
      Task.createTask(newTask, function(error, task) {
        if (error) throw error;
        res.redirect(`task/${task.parentTask}`);
      });
    }
  });
};

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