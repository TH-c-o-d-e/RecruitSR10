// routes/connexion.js

var express = require('express');
var router = express.Router();
var db = require('../model/Utilisateur.js'); // Assurez-vous que le chemin est correct
var sessionManager = require('../session');

router.get('/', function(req, res, next) {
  res.render('connexion', { title: 'Connexion' });
});

router.post('/', function(req, res, next) {
  var email = req.body.email;
  var mot_de_passe = req.body.mot_de_passe;

  db.areValid(email, mot_de_passe, function(isValid, user) {
    if (isValid) {
      sessionManager.createSession(req.session, user.id, user.type);

      // Redirection en fonction du type d'utilisateur
      switch (user.type) {
        case  1 : // Candidat
          res.redirect('/accueil_utilisateur');
          break;
        case 2: // Recruteur
          res.redirect('/accueil_recruteur');
          break;
        case 0 : // Administrateur
          res.redirect('/accueil_administrateur');
          break;
        default:
          res.redirect('/'); // Redirection par défaut si le type n'est pas reconnu
      }
    } else {
      res.render('connexion', { title: 'Connexion', error: 'Email ou mot de passe incorrect' });
    }
  });
});

module.exports = router;
