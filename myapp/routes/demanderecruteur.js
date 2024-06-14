const express = require('express');
var router = express.Router();
const demandeRecruteurModel = require('../model/DemandeRecruteur');

// Route pour récupérer une demande de recruteur par demandeur et organisation
router.get('/:demandeur/:organisation', function(req, res, next) {
  const demandeur = req.params.demandeur;
  const organisation = req.params.organisation;

  demandeRecruteurModel.read(demandeur, organisation, function(result) {
    if (result.length > 0) {
      res.render('demandeRecruteur', { title: 'Demande de recruteur', demandeRecruteur: result[0] });
    } else {
      res.status(404).send('Demande non trouvée.');
    }
  });
});

// Route pour récupérer toutes les demandes de recruteur
router.get('/', function(req, res, next) {
  demandeRecruteurModel.readAll(function(result) {
    res.render('demandesRecruteur', { title: 'Liste des demandes de recruteur', demandesRecruteur: result });
  });
});

// Route pour créer une demande de recruteur
router.post('/', function(req, res, next) {
  const { demandeur, organisation } = req.body;

  demandeRecruteurModel.create(demandeur, organisation, function(success) {
    if (success) {
      res.redirect('/demandesRecruteur');
    } else {
      res.status(500).send('Erreur lors de la création de la demande.');
    }
  });
});

// Route pour mettre à jour une demande de recruteur
router.put('/:demandeur/:organisation', function(req, res, next) {
  const demandeur = req.params.demandeur;
  const organisation = req.params.organisation;

  demandeRecruteurModel.update(demandeur, organisation, function(success) {
    if (success) {
      res.redirect('/demandesRecruteur');
    } else {
      res.status(500).send('Erreur lors de la mise à jour de la demande.');
    }
  });
});

// Route pour supprimer une demande de recruteur
router.delete('/:demandeur/:organisation', function(req, res, next) {
  const demandeur = req.params.demandeur;
  const organisation = req.params.organisation;

  demandeRecruteurModel.delete(demandeur, organisation, function(success) {
    if (success) {
      res.redirect('/demandesRecruteur');
    } else {
      res.status(500).send('Erreur lors de la suppression de la demande.');
    }
  });
});

// Route pour filtrer, trier et rechercher des demandes de recruteur
router.get('/filter', function(req, res, next) {
  const filter = req.query.filter;
  const value = req.query.value;
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;
  const search = req.query.search;

  let queryFunction;
  let title;

  switch (filter) {
    case 'demandeur':
      queryFunction = demandeRecruteurModel.readByDemandeur;
      title = 'Liste des demandes de recruteur par demandeur';
      break;
    case 'organisation':
      queryFunction = demandeRecruteurModel.readByOrganisation;
      title = 'Liste des demandes de recruteur par organisation';
      break;
    default:
      queryFunction = demandeRecruteurModel.search;
      title = 'Liste des demandes de recruteur';
      break;
  }

  queryFunction(value || search, function(result) {
    if (sortBy && sortOrder) {
      result.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (a[sortBy] > b[sortBy]) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
      title += ' triées par ' + sortBy;
    }
    res.render('demandesRecruteur', { title: title, demandesRecruteur: result });
  });
});

module.exports = router;
