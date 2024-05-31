var express = require('express');
var router = express.Router();
const DB = require("../model/connexion_db.js");
const candidatureModel = require('../model/Candidature.js'); 

/* GET candidatures listing. */
router.get('/candidatureslist', function (req, res, next) {
  candidatureModel.readall(function (result) {
    res.render('candidaturesList', { title: 'Liste des candidatures', candidatures: result });
  });
});

/* On met à jour une candidature */
router.put('/editcandidature', function (req, res, next) {
  const id = req.body.id;
  const offre = req.body.offre;
  const candidat = req.body.candidat;
  const date = req.body.date;
  const pieces = req.body.pieces;
  candidatureModel.update(id, offre, candidat, date, pieces, function (err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la mise à jour de la candidature.");
    } else if (success) {
      res.send("Mise à jour de la candidature réussie.");
    } else {
      res.status(404).send("La candidature n'a pas été trouvée.");
    }
  });
});

/* On crée une candidature */
router.post('/createcandidature', function(req, res, next) {
  const newCandidature = req.body;
  candidatureModel.creat(newCandidature.offre, newCandidature.candidat, newCandidature.date, newCandidature.pieces, function(err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la création de la candidature.");
    } else {
      res.redirect("/candidatureslist");
    }
  });
});

/* On supprime une candidature */
router.delete('/deletecandidature', function (req, res, next) {
  const id = req.body.id;
  candidatureModel.deleteById(id, function(err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de la candidature.");
    } else if (success) {
      res.send("Suppression réussie.");
    } else {
      res.status(404).send("La candidature n'a pas été trouvée.");
    }
  });
});

module.exports = router;
