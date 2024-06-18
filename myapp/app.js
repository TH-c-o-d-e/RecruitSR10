var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('./session');
var app = express();

var indexRouter = require('./routes/index');
var inscriptionRouter = require('./routes/inscription');
var connexionRouter = require('./routes/connexion');
var accueilUtilisateurRouter = require('./routes/accueil_utilisateur'); // Importer la nouvelle route

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session.init()); // Initialiser la session

app.use('/', indexRouter);
app.use('/inscription', inscriptionRouter);
app.use('/connexion', connexionRouter);
app.use('/accueil_utilisateur', accueilUtilisateurRouter); // Utiliser la nouvelle route

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
