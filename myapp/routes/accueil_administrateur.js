var express = require('express');
var router = express.Router();
var sessionManager = require('../session');
var db = require('../model/Utilisateur.js'); // Assurez-vous que le chemin est correct

router.get('/', function(req, res, next) {
  if (!sessionManager.isConnected(req.session)) {
    return res.redirect('/connexion');
  }

  if (req.session.type !== 0) { // Assurez-vous que l'utilisateur est un administrateur
    return res.redirect('/accueil_utilisateur');
  }

  db.read(req.session.userid, function(err, user) {
    if (err) {
      return next(err);
    }
    res.render('accueil_administrateur', { title: 'Accueil Administrateur', user: user });
  });
});

module.exports = router;
