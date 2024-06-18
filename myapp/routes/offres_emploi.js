const express = require('express');
const router = express.Router();
const offreModel = require('../model/Offre.js');
const ficheModel = require('../model/Fiche.js');

// Route pour afficher toutes les offres d'emploi avec pagination
router.get('/', (req, res) => {
  const pageNumber = parseInt(req.query.page) || 1; // Récupère le numéro de page depuis les paramètres de requête
  const perPage = 10; // Nombre d'offres par page

  // Récupérer les offres pour la page demandée
  offreModel.readPage(pageNumber, perPage, (offres) => {
    // Récupérer le nombre total d'offres pour la pagination
    offreModel.countAll((totalOffres) => {
      const totalPages = Math.ceil(totalOffres / perPage);

      res.render('offres_emploi', { offres, currentPage: pageNumber, totalPages });
    });
  });
});

module.exports = router;
