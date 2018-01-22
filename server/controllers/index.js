module.exports = {
  get : function(req, res) {
    res.render("index", {title : "Task Manager"});
  }
};