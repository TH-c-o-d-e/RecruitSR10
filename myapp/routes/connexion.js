var express = require('express');
var router = express.Router();
var db = require('../model/Utilisateur.js'); // Assurez-vous que le chemin est correct
var sessionManager = require('../session');

// Afficher la page de connexion
router.get('/', function(req, res, next) {
  res.render('connexion', { title: 'Connexion' });
});

// Gérer la soumission du formulaire de connexion
router.post('/', function(req, res, next) {
  var email = req.body.email;
  var mot_de_passe = req.body.mot_de_passe;

  db.areValid(email, mot_de_passe, function(isValid, user) {
    if (isValid) {
      sessionManager.createSession(req.session, user.id, user.type);
      res.redirect('/accueil_utilisateur');
    } else {
      res.render('connexion', { title: 'Connexion', error: 'Email ou mot de passe incorrect' });
    }
  });
});

module.exports = router;
