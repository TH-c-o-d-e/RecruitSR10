var express = require('express');
var router = express.Router();
const DB = require("../model/connexion_db.js");
const ficheModel = require('../model/Fiche.js'); 

/* GET fiches listing. */
router.get('/ficheslist', function (req, res, next) {
  ficheModel.readall(function (result) {
    res.render('fichesList', { title: 'Liste des fiches', fiches: result });
  });
});

/* On met à jour une fiche */
router.put('/editfiche', function (req, res, next) {
  const id = req.body.id;
  const intitule = req.body.intitule;
  const organisation = req.body.organisation;
  const statut_poste = req.body.statut_poste;
  const responsable = req.body.responsable;
  const lieu_mission = req.body.lieu_mission;
  const rythme = req.body.rythme;
  const fourchette = req.body.fourchette;
  ficheModel.update(id, intitule, organisation, statut_poste, responsable, lieu_mission, rythme, fourchette, function (err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la mise à jour de la fiche.");
    } else if (success) {
      res.send("Mise à jour de la fiche réussie.");
    } else {
      res.status(404).send("La fiche n'a pas été trouvée.");
    }
  });
});

/* On crée une fiche */
router.post('/createfiche', function(req, res, next) {
  const newFiche = req.body;
  ficheModel.creat(newFiche.intitule, newFiche.organisation, newFiche.statut_poste, newFiche.responsable, newFiche.lieu_mission, newFiche.rythme, newFiche.fourchette, function(err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la création de la fiche.");
    } else {
      res.redirect("/ficheslist");
    }
  });
});

/* On supprime une fiche */
router.delete('/deletefiche', function (req, res, next) {
  const id = req.body.id;
  ficheModel.deleteById(id, function(err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de la fiche.");
    } else if (success) {
      res.send("Suppression réussie.");
    } else {
      res.status(404).send("La fiche n'a pas été trouvée.");
    }
  });
});

/* GET fiches by intitule */
router.get('/fichesbyintitule/:intitule', function (req, res, next) {
  const intitule = req.params.intitule;
  ficheModel.readByIntitule(intitule, function (result) {
    res.render('fichesList', { title: 'Liste des fiches par intitulé', fiches: result });
  });
});

/* GET fiches by organisation */
router.get('/fichesbyorganisation/:organisation', function (req, res, next) {
  const organisation = req.params.organisation;
  ficheModel.readByOrganisation(organisation, function (result) {
    res.render('fichesList', { title: 'Liste des fiches par organisation', fiches: result });
  });
});

/* GET fiches by statut poste */
router.get('/fichesbystatutposte/:statut_poste', function (req, res, next) {
  const statut_poste = req.params.statut_poste;
  ficheModel.readByStatutPoste(statut_poste, function (result) {
    res.render('fichesList', { title: 'Liste des fiches par statut de poste', fiches: result });
  });
});


module.exports = router;
