var express = require('express');
var router = express.Router();
const DB = require("../model/connexion_db.js");
const organisationModel = require('../model/Organisation.js'); // Assurez-vous d'importer correctement votre modèle d'organisation

/* GET organisations listing. */
router.get('/organisationslist', function (req, res, next) {
  organisationModel.readall(function (result) {
    res.render('organisationsList', { title: 'Liste des organisations', organisations: result });
  });
});

/* On met à jour une organisation */
router.put('/editorganisation', function (req, res, next) {
  const SIREN = req.body.SIREN;
  const nom = req.body.nom;
  const type = req.body.type;
  const siege_social = req.body.siege_social;
  organisationModel.update(SIREN, nom, type, siege_social, function (err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la mise à jour de l'organisation.");
    } else if (success) {
      res.send("Mise à jour de l'organisation réussie.");
    } else {
      res.status(404).send("L'organisation n'a pas été trouvée.");
    }
  });
});

/* On crée une organisation */
router.post('/createorganisation', function(req, res, next) {
  const newOrganisation = req.body;
  organisationModel.alreadyExists(newOrganisation.SIREN, function(err, exists) {
    if (err) {
      res.status(500).send("Erreur lors de la vérification de l'existence de l'organisation.");
    } else if (exists) {
      res.status(401).send("L'organisation existe déjà \n");
    } else {
      organisationModel.creat(newOrganisation.SIREN, newOrganisation.nom, newOrganisation.type, newOrganisation.siege_social, function(err, result) {
        if (err) {
          res.status(500).send("Erreur lors de la création de l'organisation.");
        } else {
          res.redirect("/organisationslist");
        }
      });
    }
  });
});

/* On supprime une organisation */
router.delete('/deleteorganisation', function (req, res, next) {
  const SIREN = req.body.SIREN;
  organisationModel.delete(SIREN, function(err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de l'organisation.");
    } else if (success) {
      res.send("Suppression réussie.");
    } else {
      res.status(404).send("L'organisation n'a pas été trouvée.");
    }
  });
});

module.exports = router;
