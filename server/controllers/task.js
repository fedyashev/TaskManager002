var Task = require("../models/task");
var url = require("url");

module.exports.get = (req, res, next) => {
  Task.getRootTask(req.user, (err, task) => {
    if (err) {
      return next(err);
    }
    if (task) {
      res.redirect(`task/${task._id}`);
    }
    else {
      res.status(404).render("errors/404", {message : "Task not found."});
    }
  });
};

module.exports.getId = (req, res, next) => {
  let taskId = url.parse(req.url).path.slice(1);
  Task.getTaskById(taskId, (err, task) => {
    if (err) {
      return next(err);
    }
    if (task && (req.user._id.toString() === task.userId.toString())) {
      Task
        .findOne(task)
        .populate({
          path: "childTasks",
          populate: {
            path: "childTasks"
          }
        })
        .exec((err, task) => {
          if (err) {
            return next(err);
          }
          //console.log(JSON.stringify(task));
          // task.childTasks.forEach(element => {
          //   console.log(element.name);
          // });
          res.render("task/task", task);
        });
      // task.populate("childTasks").exec(function(error, task) {
      //   res.render("task/task", task);
      // });
    }
    else {
      res.status(404).render("errors/404", {message : "Task not found."});  
    }
  });
};

module.exports.postId = function(req, res) {
  let taskId = url.parse(req.url).path.slice(1);
  Task.getTaskById(taskId, function(error, parentTask) {
    if (error) throw error;
    if (parentTask && (req.user._id.toString() === parentTask.userId.toString())) {
      let newTask = new Task({
        userId : req.user._id,
        parentTask : parentTask._id,
        name : req.body.name
      });
      Task.createTask(newTask, function(error, task) {
        if (error) throw error;
        parentTask.childTasks.unshift(task._id);
        Task.saveTask(parentTask, function(error, parentTask) {
          if (error) throw error;
          //console.log(parentTask);
          res.redirect(`${parentTask._id}`);
        });
      });
    }
  });
};

module.exports.deleteId = function(req, res) {
  let taskId = url.parse(req.url).path.slice(1);
  Task.deleteTaskById(taskId, function(error, task) {
    console.log(task);
    res.status(204).json({data: "Deleted"});
  });
}

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