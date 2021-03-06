var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Gestión de las rutas web del proyecto
var routes = require('./routes/index');
// Gestión de marcos para renderizado de las páginas
var partials = require('express-partials');
// Gestión de sobrecarga de métodos HTTP (PUT; DELETE)
var methodOverride = require('method-override');
// Gestión de sesión de usuario
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
// Usar los marcos para renderizado
app.use(partials());
// Usar la sobrecarga de métodos
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Helpers dinámicos para inicio de sesión
app.use(function (req, res, next) {
  // Guardar path en session.redir para poder usarla una vez hecho el login
  if (req.method === 'GET' && !req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }
  // Hacer visible req.session en las visitas
  res.locals.session = req.session;

  // Algoritmo de Auto Logout
  if (req.session.timeLogout) {
    var now = Date.now();
    var tiempo = now - req.session.timeLogout;
    // Dos minutos = 120 segundos = 120000 milisegundos
    if (tiempo > 120000) {
      // Necesario para evitar bucle de redireccionamientos
      delete req.session.timeLogout;
      delete req.session.user;
      req.session.autoLogout = true;
      res.redirect('/login');
    } else {
      req.session.timeLogout = now;
    }
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
