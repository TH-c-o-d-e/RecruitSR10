var express = require('express');
var router = express.Router();
const organisationModel = require('../model/Organisation.js');

/* GET organisations listing. */
router.get('/organisationslist', function (req, res, next) {
  organisationModel.readAll(function (result) {
    res.render('organisationsList', { title: 'Liste des organisations', organisations: result });
  });
});

/* On met à jour une organisation */
router.put('/editorganisation', function (req, res, next) {
  const siren = req.body.siren;
  const nom = req.body.nom;
  const type = req.body.type;
  const siege_social = req.body.siege_social;
  organisationModel.update(siren, nom, type, siege_social, function (err, success) {
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
  const siren = req.body.siren;
  const nom = req.body.nom;
  const type = req.body.type;
  const siege_social = req.body.siege_social;
  organisationModel.create(siren, nom, type, siege_social, function(err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la création de l'organisation.");
    } else {
      res.redirect("/organisationslist");
    }
  });
});

/* On supprime une organisation */
router.delete('/deleteorganisation', function (req, res, next) {
  const siren = req.body.siren;
  organisationModel.delete(siren, function(err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de l'organisation.");
    } else if (success) {
      res.send("Suppression réussie.");
    } else {
      res.status(404).send("L'organisation n'a pas été trouvée.");
    }
  });
});

/* GET organisations by type */
router.get('/organisationsbytype/:type', function (req, res, next) {
  const type = req.params.type;
  organisationModel.readByType(type, function (result) {
    res.render('organisationsList', { title: 'Liste des organisations par type', organisations: result });
  });
});

/* GET organisations by siege_social */
router.get('/organisationsbysiegesocial/:siege_social', function (req, res, next) {
  const siege_social = req.params.siege_social;
  organisationModel.readBySiegeSocial(siege_social, function (result) {
    res.render('organisationsList', { title: 'Liste des organisations par siège social', organisations: result });
  });
});
