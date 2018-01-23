module.exports = {
  ensureAuthenticated : function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    }
    else {
      req.flash("error_msg", "You are not logged in.");
      res.redirect("/auth/login");
    }
  }
};