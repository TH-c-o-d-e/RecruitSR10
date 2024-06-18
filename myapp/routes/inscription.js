// routes/inscription.js

const express = require('express');
const router = express.Router();
const userModel = require('../model/Utilisateur'); // Assurez-vous que le chemin est correct


// Afficher le formulaire d'inscription
router.get('/', (req, res) => {
  res.render('inscription'); // Utilisation de la vue EJS inscription.ejs
});

// Traiter les données du formulaire d'inscription
router.post('/', function(req, res, next) {
    var email = req.body.email;
    var mot_de_passe = req.body.mot_de_passe;
    var prenom = req.body.prenom;
    var nom = req.body.nom;
    var coordonnees = req.body.coordonnees;
    var statut_compte = 1; // Par exemple, statut par défaut à 1
    var type_compte = 1; // Par exemple, type de compte par défaut à 1
    var organisation = req.body.organisation || null;
  
    userModel.create(email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, function(success, message) {
      if (success) {
        res.redirect('inscription/success_inscription');
      } else {
        res.render('error_inscription', { title: 'Inscription', error: message });
      }
    });
  });
  
// Afficher la page de succès
router.get('/success_inscription', (req, res) => {
  res.render('success_inscription');
});

// Afficher la page d'erreur
router.get('/error_inscription', (req, res) => {
  res.render('error_inscription');
});

module.exports = router;
