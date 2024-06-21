const express = require('express');
const router = express.Router();
const organisationModel = require('../model/Organisation.js');
const demandeOrganisationModel = require('../model/DemandeOrganisation.js');

// Middleware pour vérifier si l'utilisateur est administrateur
function isAdmin(req) {
  return req.session.user && req.session.user.type === 0; // type 0 pour Admin
}

// Route pour afficher le formulaire de création d'une nouvelle entreprise
router.get('/nouvelle', (req, res) => {
  res.render('formulaire_entreprise');
});


// Route pour créer une demande d'organisation
router.post('/nouvelle', (req, res) => {
  const demandeur = req.session.user.id; // Récupération de l'ID de l'utilisateur connecté depuis la session
  const { date, siren, nom, type, siege_social } = req.body;

  demandeOrganisationModel.create(demandeur, date, siren, nom, type, siege_social, (success) => {
    if (success) {
      res.redirect('/gestion_demande_organisation'); // Redirection après succès
    } else {
      res.status(500).send('Erreur lors de la création de la demande d\'organisation');
    }
  });
});

module.exports = router;
