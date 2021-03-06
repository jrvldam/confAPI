var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var swig = require('swig');

var index = require('./routes/index');
var getObj = require('./routes/getJson');
var sendObj = require('./routes/sendJson');
var sendDir = require('./routes/sendDir');

var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
// app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/get', getObj);
app.use('/datos', sendObj);
app.use('/dir', sendDir);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
