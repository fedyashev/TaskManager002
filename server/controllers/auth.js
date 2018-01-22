module.exports = {
  get_login : function(req, res) {
    res.render("login", {title : "Log in"});
  },

  get_register : function(req, res) {
    res.render("registration", {title : "Registration"});
  },

  get_logout : function(req, res) {
    res.end("logout");
  },

  post_register : function(req, res) {
    var name = req.body.name;

    req.checkBody("name", "Name is required.").notEmpty();

    let errors = req.validationErrors();

    if (errors) {
      res.render("registration", {errors : errors});
    }
    else {
      console.log("PASSED");
    }

  }
};