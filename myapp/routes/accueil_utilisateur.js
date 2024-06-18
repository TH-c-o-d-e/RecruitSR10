var express = require('express');
var router = express.Router();
var db = require('../model/Utilisateur'); // Assurez-vous que le chemin est correct
var sessionManager = require('../session');

// Middleware pour vérifier si l'utilisateur est connecté
router.use((req, res, next) => {
  if (!sessionManager.isConnected(req.session)) {
    return res.redirect('/connexion');
  }
  next();
});

// Route pour afficher la page d'accueil de l'utilisateur
router.get('/', function(req, res, next) {
  db.read(req.session.userid, function(err, user) {
    if (err) return next(err);
    if (!user) return res.redirect('/connexion');
    res.render('accueil_utilisateur', { user });
  });
});

module.exports = router;
