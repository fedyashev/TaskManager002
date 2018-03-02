const express = require('express');
const expressSession = require("express-session");
const validator = require("express-validator");
const exphbs = require("express-handlebars");
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require("connect-flash");
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportConfig = require("./config/passport-config")(passport);

const middleware = require("./middleware/index");

const credentials = require("./credentials");
mongoose.connect(credentials.mlab.connectionString);

const index = require('./routes/index');
const users = require('./routes/users');
const auth = require("./routes/auth");
const task = require("./routes/task");

const app = express();

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
  const err = new Error('Not Found');
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
