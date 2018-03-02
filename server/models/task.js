const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    userId : { type : Schema.Types.ObjectId, ref : "User" },
    parentTask : { type : Schema.Types.ObjectId, ref : "Task", default: null},
    childTasks : [{ type : Schema.Types.ObjectId, ref : "Task"}],
    name : {type : String, default : ""},
    description : {type : String, default : ""},
    creationDate : {type : Date, default : Date.now},
    completedData : {type : Date, default : null}
});

TaskSchema.pre("remove", function(next) {
    this.populate("childTasks", function(error, task) {
        if (error) throw error;
        task.childTasks.forEach(child => {
            child.remove({_id : child._id}, function(error, task) {
                if (error) throw error;
            });
        });
    });
    next();
});

TaskSchema.post("remove", function(removed) {
    removed.populate("parentTask", function(error, task) {
        if (error) throw error;
        let parent = task.parentTask;
        if (parent !== null) {
            let index = parent.childTasks.indexOf(removed._id);
            parent.childTasks.splice(index, 1);
            parent.save(function(error, task) {
                if (error) throw error;
            });
        }
    });
});

let Task = mongoose.model("Task", TaskSchema);

Task.createTask = function(newTask, callback) {
    newTask.save(callback);
};

Task.saveTask = function(task, callback) {
    task.save(callback);
};

Task.deleteTaskById = (id, callback) => {
    Task.findOne({_id : id}, function(error, task) {
        if (error) throw error;
        task.remove(callback);
    });
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

// let Task = mongoose.model("Task", TaskSchema);
// module.exports = Task;