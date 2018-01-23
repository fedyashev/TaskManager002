var express = require('express');
var expressSession = require("express-session");
var validator = require("express-validator");
var exphbs = require("express-handlebars");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require("connect-flash");
var MongoStore = require("connect-mongo")(expressSession);
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var middleware = require("./middleware/index");

var credentials = require("./credentials");
mongoose.connect(credentials.mlab.connectionString);

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require("./routes/auth");
var task = require("./routes/task");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine("handlebars", exphbs({defaultLayout : "layout"}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret : "nodejs",
  resave : false,
  saveUninitialized : true,
  store : new MongoStore({
    url : credentials.mlab.connectionString,
    autoRemove : "native"
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(validator({
  errorFormatter : function (param, msg, value) {
    let namespace = param.split(".");
    let root = namespace.shift();
    let formParam = root;
    while (namespace.lenght) {
      formParam += `[${namespace.shift()}]`;
    }
    return {
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));
app.use(flash());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use('/', index);
app.use('/users', users);
app.use("/auth", auth);
app.use("/task", middleware.ensureAuthenticated, task);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
