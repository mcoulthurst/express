var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connectLivereload = require("connect-livereload");
const livereload = require('livereload');
const nunjucks = require('nunjucks');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(connectLivereload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// set up nunjucjs
nunjucks.configure('views', {
  express: app,
  autoescape: true
});
app.set('view engine', 'html')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

// live reload of browser, listening high up in the ports
var liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

// wait for high port to re-establish...
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

module.exports = app;
