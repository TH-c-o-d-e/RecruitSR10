const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sessionManager = require('./session');

// Importation des routes
const indexRouter = require('./routes/index');
const inscriptionRouter = require('./routes/inscription');
const connexionRouter = require('./routes/connexion');
const deconnexionRouter = require('./routes/deconnexion');
const accueilUtilisateurRouter = require('./routes/accueil_utilisateur');
const accueilRecruteurRouter = require('./routes/accueil_recruteur');
const accueilAdminRouter = require('./routes/accueil_administrateur');
const gestionUtilisateursRouter = require('./routes/gestion_utilisateurs');
const modifierUtilisateurRouter = require('./routes/modifier_utilisateur');
const offresEmploiRouter = require('./routes/offres_emploi');
const recruteurRouter = require('./routes/recruteur');
const entreprisesRouter = require('./routes/entreprises');
const gestionDemandeOrganisationRouter = require('./routes/gestion_demande_organisation');
const candidaterRouter = require("./routes/candidater.js");
const fichePosteRouter =require("./routes/ficheposte.js")
const auth = require('./middlewares/auth');

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

// Middleware d'authentification pour protéger les routes suivantes
app.use((req, res, next) => {
  if (sessionManager.isConnected(req.session)) {
    next();
  } else {
    res.redirect('/connexion');
  }
});

app.use('/accueil_utilisateur', accueilUtilisateurRouter);
app.use('/accueil_recruteur', accueilRecruteurRouter);
app.use('/accueil_administrateur', accueilAdminRouter);
app.use('/gestion_utilisateurs', gestionUtilisateursRouter);
app.use('/modifier_utilisateur', modifierUtilisateurRouter);
app.use('/offres_emploi', offresEmploiRouter);
app.use('/recruteur', recruteurRouter);
app.use('/entreprises', entreprisesRouter);
app.use('/gestion_demande_organisation', auth, gestionDemandeOrganisationRouter);
app.use('/ficheposte/', fichePosteRouter); // Route pour la création de fiche de poste
app.use("/candidater", candidaterRouter)

// Middleware pour gérer les erreurs 404 et les passer au middleware d'erreur
app.use(function(req, res, next) {
  next(createError(404));
});

// Middleware d'erreur
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
