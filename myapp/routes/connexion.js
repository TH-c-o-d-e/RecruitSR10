var express = require('express');
var router = express.Router();
var db = require('../model/Utilisateur.js'); // Assurez-vous que le chemin est correct

// Afficher la page de connexion
router.get('/', function(req, res, next) {
  res.render('connexion', { title: 'Connexion' });
});

// Gérer la soumission du formulaire de connexion
router.post('/', function(req, res, next) {
  var email = req.body.email;
  var mdp = req.body.mdp;

  db.areValid(email, mdp, function(isValid) {
    if (isValid) {
      res.redirect('/');
    } else {
      res.redirect('/error_inscription');
    }
  });
});

module.exports = router;
