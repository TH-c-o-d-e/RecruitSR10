var express = require('express');
var router = express.Router();
const candidatureModel = require('../model/Candidature.js');

/* GET candidatures listing. */
router.get('/candidatureslist', function (req, res, next) {
  candidatureModel.readAll(function (result) {
    res.render('candidaturesList', { title: 'Liste des candidatures', candidatures: result });
  });
});

/* On met à jour une candidature */
router.put('/editcandidature', function (req, res, next) {
  const offre = req.body.offre;
  const candidat = req.body.candidat;
  const date = req.body.date;
  const pieces = req.body.pieces;
  candidatureModel.update(offre, candidat, date, pieces, function (err, success) {
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
  const offre = req.body.offre;
  const candidat = req.body.candidat;
  const date = req.body.date;
  const pieces = req.body.pieces;
  candidatureModel.create(offre, candidat, date, pieces, function(err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la création de la candidature.");
    } else {
      res.redirect("/candidatureslist");
    }
  });
});

/* On supprime une candidature */
router.delete('/deletecandidature', function (req, res, next) {
  const offre = req.body.offre;
  const candidat = req.body.candidat;
  candidatureModel.delete(offre, candidat, function(err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de la candidature.");
    } else if (success) {
      res.send("Suppression réussie.");
    } else {
      res.status(404).send("La candidature n'a pas été trouvée.");
    }
  });
});

/* GET candidatures by offre */
router.get('/candidaturesbyoffre/:offre', function (req, res, next) {
  const offre = req.params.offre;
  candidatureModel.readByOffre(offre, function (result) {
    res.render('candidaturesList', { title: 'Liste des candidatures par offre', candidatures: result });
  });
});

/* GET candidatures by candidat */
router.get('/candidaturesbycandidat/:candidat', function (req, res, next) {
  const candidat = req.params.candidat;
  candidatureModel.readByCandidat(candidat, function (result) {
    res.render('candidaturesList', { title: 'Liste des candidatures par candidat', candidatures: result });
  });
});

/* GET candidatures by date */
router.get('/candidaturesbydate/:date', function (req, res, next) {
  const date = req.params.date;
  candidatureModel.readByDate(date, function (result) {
    res.render('candidaturesList', { title: 'Liste des candidatures par date', candidatures: result });
  });
});
