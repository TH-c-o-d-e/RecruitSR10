const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sessionManager = require('./session'); // Assurez-vous d'avoir le bon chemin vers votre gestionnaire de session

// Importation des routes
const indexRouter = require('./routes/index');
const inscriptionRouter = require('./routes/inscription');
const connexionRouter = require('./routes/connexion');
const deconnexionRouter = require('./routes/deconnexion');
const accueilUtilisateurRouter = require('./routes/accueil_utilisateur');
const accueilRecruteurRouter = require('./routes/accueil_recruteur'); // Assurez-vous d'avoir le bon chemin vers la route d'accueil du recruteur
const accueilAdminRouter = require('./routes/accueil_administrateur'); // Assurez-vous d'avoir le bon chemin vers la route d'accueil de l'administrateur
const gestionUtilisateursRouter = require('./routes/gestion_utilisateurs');
const modifierUtilisateurRouter = require('./routes/modifier_utilisateur');
const offresEmploiRouter = require('./routes/offres_emploi'); // Assurez-vous d'avoir le bon chemin vers la route des offres d'emploi
const recruteurRouter = require('./routes/recruteur'); // Assurez-vous d'avoir le bon chemin vers le fichier de routes du recruteur

const app = express();

// Initialisation des sessions
app.use(sessionManager.init());

// Configuration du moteur de vue
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware de logging
app.use(logger('dev'));

// Middleware pour parser le corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware pour parser les cookies
app.use(cookieParser());

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Utilisation des routes dans l'application
app.use('/', indexRouter);
app.use('/inscription', inscriptionRouter);
app.use('/connexion', connexionRouter);
app.use('/deconnexion', deconnexionRouter);
app.use('/accueil_utilisateur', accueilUtilisateurRouter);
app.use('/accueil_recruteur', accueilRecruteurRouter);
app.use('/accueil_administrateur', accueilAdminRouter);
app.use('/gestion_utilisateurs', gestionUtilisateursRouter);
app.use('/modifier_utilisateur', modifierUtilisateurRouter);
app.use('/offres_emploi', offresEmploiRouter);
app.use('/recruteur', recruteurRouter); // Utilisation des routes du recruteur

// Middleware pour gérer les erreurs 404 et les passer au middleware d'erreur
app.use(function(req, res, next) {
  next(createError(404));
});

// Middleware d'erreur
app.use(function(err, req, res, next) {
  // Gestion des erreurs de développement
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Rendu de la page d'erreur
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
