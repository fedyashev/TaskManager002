let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let TaskSchema = new Schema({
    userId : { type : Schema.Types.ObjectId, ref : "User" },
    parentTask : { type : Schema.Types.ObjectId, ref : "Task", default: null},
    childTasks : [{ type : Schema.Types.ObjectId, ref : "Task"}],
    name : {type : String, default : ""},
    description : {type : String, default : ""},
    creationDate : {type : Date, default : Date.now},
    completedData : {type : Date, default : null}
});

let Task = mongoose.model("Task", TaskSchema);

Task.createTask = function(newTask, callback) {
    newTask.save(callback);
};

Task.saveTask = function(task, callback) {
    task.save(callback);
};

Task.createRootTask = function(user, callback) {
    let task = new Task({
        userId : user._id,
        name : user._id
    });
    task.save(callback);
};

Task.getRootTask = function(user, callback) {
    let query = {
        userId : user._id,
        parentTask : null
    };
    Task.findOne(query, callback);
};

Task.appendChildTask = function(parentTask, childTask, callback) {
    parentTask.childTasks.push(childTask._id);
    parentTask.save(callback);
};

Task.getTaskById = function(taskId, callback) {
    let query = {_id : taskId};
    Task.findOne(query, callback);
};

module.exports = Task;