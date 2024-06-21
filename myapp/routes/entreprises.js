const express = require('express');
const router = express.Router();
const organisationModel = require('../model/Organisation.js');
const demandeOrganisationModel = require('../model/DemandeOrganisation.js');
const sessionManager = require('../session');

// Middleware pour vérifier l'authentification
router.use(sessionManager.isConnected);

// Route pour afficher le formulaire de création d'une nouvelle entreprise
router.get('/nouvelle', (req, res) => {
  res.render('formulaire_entreprise');
});

// Route pour créer une demande d'organisation
router.post('/nouvelle', (req, res) => {
  const demandeur = req.session.userid; // Utilisation de req.session.userid pour récupérer l'ID de l'utilisateur connecté
  const { siren, nom, type, siege_social } = req.body;

  // Création de la demande d'organisation
  demandeOrganisationModel.create(demandeur, new Date(), siren, nom, type, siege_social, (demandeAdded) => {
    if (demandeAdded) {
      res.redirect('/entreprises'); // Redirection après succès pour autres utilisateurs
    } else {
      res.status(500).send('Erreur lors de la création de la demande d\'organisation');
    }
  });
});

module.exports = router;
