// routes/accueil_recruteur.js

var express = require('express');
var router = express.Router();
var sessionManager = require('../session');
var db = require('../model/Utilisateur.js'); // Assurez-vous que le chemin est correct

router.get('/', function(req, res, next) {
  if (!sessionManager.isConnected(req.session)) {
    return res.redirect('/connexion');
  }

  if (req.session.type !== 2) { // Assurez-vous que l'utilisateur est un recruteur
    return res.redirect('/accueil_utilisateur');
  }

  db.read(req.session.userid, function(err, user) {
    if (err) {
      return next(err);
    }
    res.render('accueil_recruteur', { title: 'Accueil Recruteur', user: user });
  });
});

module.exports = router;
