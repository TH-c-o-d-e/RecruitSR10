const express = require('express');
const router = express.Router();
const organisationModel = require('../model/Organisation');

// Route pour afficher le formulaire de création d'une nouvelle entreprise
router.get('/nouvelle', (req, res) => {
  res.render('formulaire_entreprise');
});

// Route pour gérer la création d'une nouvelle entreprise
router.post('/nouvelle', (req, res) => {
  const { siret, nom, type, num_rue, rue, ville, code_postal, pays } = req.body;

  // Assemblage de l'adresse
  const siege_social = `${num_rue} ${rue}, ${code_postal} ${ville}, ${pays}`;

  // Appel à la méthode de création du modèle
  organisationModel.create(siret, nom, type, siege_social, (success) => {
    if (success) {
      res.redirect('/recruteur'); // Redirection vers l'accueil recruteur
    } else {
      res.status(500).send('Erreur lors de la création de l\'entreprise');
    }
  });
});

module.exports = router;
