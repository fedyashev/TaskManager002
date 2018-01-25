var User = require("../models/user");
var Task = require("../models/task");

module.exports = {
  get_login : function(req, res) {
    res.render("login", {title : "Login"});
  },

  get_register : function(req, res) {
    res.render("registration", {title : "Registration"});
  },

  get_logout : function(req, res) {
    req.logout();
    //req.flash("success_msg", "You are logged out.");
    res.redirect("/auth/login");
  },

  post_register : function(req, res, next) {
    let user = {
      name : req.body.name,
      username : req.body.username,
      email : req.body.email,
      password : req.body.password,
      password2 : req.body.password2
    };
    req.checkBody("name", "Name is required.").notEmpty();
    req.checkBody("username", "Username is requied.").notEmpty();
    req.checkBody("email", "Email is required.").notEmpty();
    req.checkBody("password", "Password is required.").notEmpty();
    req.checkBody("password2", "Password do not match.").equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
      //res.render("registration", {errors : errors});
      req.flash("error", errors.map((p) => {return p.msg;}).join("\n"));
      res.redirect("/auth/register");
    }
    else {
      let newUser = new User({
        name : user.name,
        username : user.username,
        email : user.email,
        password : user.password
      });
      User.createUser(newUser, function(error, user) {
        if (error) throw error;
        console.log(user);
        Task.createRootTask(user, function(error, task) {
          if (error) throw error;
          console.log("Create a root task.");
          console.log(task);
        });
      });
      //res.render("registration", {success : { msg : "Registration success!"}});
      //req.flash("success_msg", "You are registred and can now login.");
      res.redirect("/auth/login");
    }
  },

  post_login : function(req, res) {
    res.redirect("/");
  }
};