var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// Globals constants
app.locals.SESSION_TIMEOUT = 120000;
app.locals.DEFAULT_TIME = 0;

// Global variables
app.locals.lastHtmlTransactionTime = app.locals.DEFAULT_TIME;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Dynamic helpers:
app.use(function(req, res, next) {
  // Store path in session.redir for redirection after login
  if (req.method === 'GET' && !req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
    }
  // Make req.session accessible within views
  res.locals.session = req.session;

  next();
});

// Comprobar si la sesión ha expirado
// pasados 2 minutos de incatividad
app.use(function(req, res, next) {
	// Primeramente guardamos el long con la fecha y hora actuales
	var localTime = (new Date()).getTime();

	// Seguidamente comparamos la hora local con la hora préviamente guardada (solo si esta se ha guardado)
	// para comprovar si han vencido los 2 min, y si es así, llamaremos al logout
	if(app.locals.lastHtmlTransactionTime && Math.abs(localTime - app.locals.lastHtmlTransactionTime) >= app.locals.SESSION_TIMEOUT){
		delete req.session.user;
		app.locals.lastHtmlTransactionTime = app.locals.DEFAULT_TIME;
	}

	// Actualizamos la fecha de ultima transaction solo si el usuario está logueado
	if(req.session.user){
		app.locals.lastHtmlTransactionTime = (new Date()).getTime();
	}

	next();
});

app.use('/', routes);

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
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
