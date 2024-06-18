// app.js

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessionManager = require('./session');
var indexRouter = require('./routes/index');
var inscriptionRouter = require('./routes/inscription');
var connexionRouter = require('./routes/connexion');
var deconnexionRouter = require('./routes/deconnexion');
var accueilUtilisateurRouter = require('./routes/accueil_utilisateur');
var accueilRecruteurRouter = require('./routes/accueil_recruteur'); // Ajoutez cette ligne
var accueilAdminRouter = require('./routes/accueil_administrateur'); // Ajoutez cette ligne pour la route d'accueil administrateur
var app = express();

// Initialiser les sessions
app.use(sessionManager.init());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/inscription', inscriptionRouter);
app.use('/connexion', connexionRouter);
app.use('/deconnexion', deconnexionRouter);
app.use('/accueil_utilisateur', accueilUtilisateurRouter);
app.use('/accueil_recruteur', accueilRecruteurRouter); // Utilisation de la route accueil_recruteur
app.use('/accueil_administrateur', accueilAdminRouter); // Utilisation de la route pour l'accueil de l'administrateur

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
