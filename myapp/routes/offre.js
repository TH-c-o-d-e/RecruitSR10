var express = require('express');
var router = express.Router();
const offreModel = require('../model/Offre.js');

/* GET offres listing. */
router.get('/offreslist', function (req, res, next) {
  offreModel.readAll(function (result) {
    res.render('offresList', { title: 'Liste des offres', offres: result });
  });
});

/* On met à jour une offre */
router.put('/editoffre', function (req, res, next) {
  const numero_offre = req.body.numero_offre;
  const rattachement = req.body.rattachement;
  const etat = req.body.etat;
  const date_validite = req.body.date_validite;
  const indications = req.body.indications;
  const liste_pieces = req.body.liste_pieces;
  const nombre_pieces = req.body.nombre_pieces;
  offreModel.update(numero_offre, rattachement, etat, date_validite, indications, liste_pieces, nombre_pieces, function (err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la mise à jour de l'offre.");
    } else if (success) {
      res.send("Mise à jour de l'offre réussie.");
    } else {
      res.status(404).send("L'offre n'a pas été trouvée.");
    }
  });
});

/* On crée une offre */
router.post('/createoffre', function(req, res, next) {
  const numero_offre = req.body.numero_offre;
  const rattachement = req.body.rattachement;
  const etat = req.body.etat;
  const date_validite = req.body.date_validite;
  const indications = req.body.indications;
  const liste_pieces = req.body.liste_pieces;
  const nombre_pieces = req.body.nombre_pieces;
  offreModel.create(numero_offre, rattachement, etat, date_validite, indications, liste_pieces, nombre_pieces, function(err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la création de l'offre.");
    } else {
      res.redirect("/offreslist");
    }
  });
});

/* On supprime une offre */
router.delete('/deleteoffre', function (req, res, next) {
  const numero_offre = req.body.numero_offre;
  offreModel.delete(numero_offre, function(err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de l'offre.");
    } else if (success) {
      res.send("Suppression réussie.");
    } else {
      res.status(404).send("L'offre n'a pas été trouvée.");
    }
  });
});

/* GET offres by rattachement */
router.get('/offresbyrattachement/:rattachement', function (req, res, next) {
  const rattachement = req.params.rattachement;
  offreModel.readByRattachement(rattachement, function (result) {
    res.render('offresList', { title: 'Liste des offres par rattachement', offres: result });
  });
});

/* GET offres by etat */
router.get('/offresbyetat/:etat', function (req, res, next) {
  const etat = req.params.etat;
  offreModel.readByEtat(etat, function (result) {
    res.render('offresList', { title: 'Liste des offres par état', offres: result });
  });
});

/* GET offres by date_validite */
router.get('/offresbydatevalidite/:date_validite', function (req, res, next) {
  const date_validite = req.params.date_validite;
  offreModel.readByDateValidite(date_validite, function (result) {
    res.render('offresList', { title: 'Liste des offres par date de validité', offres: result });
  });
});
