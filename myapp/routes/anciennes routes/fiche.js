var express = require('express');
var router = express.Router();
const ficheModel = require('../../model/Fiche.js');

// GET /fiches : Récupère toutes les fiches
router.get('/fiches', function (req, res, next) {
  ficheModel.readAll(function (result) {
    res.render('fichesList', { title: 'Liste des fiches', fiches: result });
  });
});

// GET /fiches/:intitule : Récupère une fiche par intitule
router.get('/fiches/:intitule', function (req, res, next) {
  const intitule = req.params.intitule;
  ficheModel.readByIntitule(intitule, function (result) {
    res.render('fichesList', { title: 'Liste des fiches par intitulé', fiches: result });
  });
});

// POST /fiches : Crée une nouvelle fiche
router.post('/fiches', function(req, res, next) {
  const { intitule, organisation, statut_poste, responsable, lieu_mission, rythme, fourchette } = req.body;
  ficheModel.create(intitule, organisation, statut_poste, responsable, lieu_mission, rythme, fourchette, function(err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la création de la fiche.");
    } else {
      res.redirect("/fiches");
    }
  });
});

// PUT /fiches/:intitule/:organisation : Met à jour une fiche
router.put('/fiches/:intitule/:organisation', function (req, res, next) {
  const { intitule, organisation } = req.params;
  const { statut_poste, responsable, lieu_mission, rythme, fourchette } = req.body;
  ficheModel.update(intitule, organisation, statut_poste, responsable, lieu_mission, rythme, fourchette, function (success) {
    if (success) {
      res.send("Mise à jour de la fiche réussie.");
    } else {
      res.status(404).send("La fiche n'a pas été trouvée.");
    }
  });
});

// DELETE /fiches/:intitule/:organisation : Supprime une fiche
router.delete('/fiches/:intitule/:organisation', function (req, res, next) {
  const { intitule, organisation } = req.params;
  ficheModel.delete(intitule, organisation, function (success) {
    if (success) {
      res.send("Suppression réussie.");
    } else {
      res.status(404).send("La fiche n'a pas été trouvée.");
    }
  });
});

// GET /fiches/organisation/:organisation : Récupère les fiches par organisation
router.get('/fiches/organisation/:organisation', function (req, res, next) {
  const organisation = req.params.organisation;
  ficheModel.readByOrganisation(organisation, function (result) {
    res.render('fichesList', { title: 'Liste des fiches pour ' + organisation, fiches: result });
  });
});

module.exports = router;
