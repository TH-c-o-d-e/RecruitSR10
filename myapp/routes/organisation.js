const express = require('express');
const router = express.Router();
const organisationModel = require('../models/organisation');

// Route pour récupérer une organisation par SIREN
router.get('/:siren', function(req, res, next) {
  const siren = req.params.siren;

  organisationModel.read(siren, function(result) {
    res.render('organisation', { title: 'Organisation', organisation: result[0] });
  });
});

// Route pour récupérer toutes les organisations
router.get('/', function(req, res, next) {
  organisationModel.readAll(function(result) {
    res.render('organisations', { title: 'Liste des organisations', organisations: result });
  });
});

// Route pour créer une organisation
router.post('/', function(req, res, next) {
  const siren = req.body.siren;
  const nom = req.body.nom;
  const type = req.body.type;
  const siege_social = req.body.siege_social;

  organisationModel.create(siren, nom, type, siege_social, function(result) {
    res.redirect('/organisations');
  });
});

// Route pour mettre à jour une organisation
router.put('/:siren', function(req, res, next) {
  const siren = req.params.siren;
  const nom = req.body.nom;
  const type = req.body.type;
  const siege_social = req.body.siege_social;

  organisationModel.update(siren, nom, type, siege_social, function(result) {
    res.redirect('/organisations');
  });
});

// Route pour supprimer une organisation
router.delete('/:siren', function(req, res, next) {
  const siren = req.params.siren;

  organisationModel.delete(siren, function(result) {
    res.redirect('/organisations');
  });
});

// Route pour filtrer, trier et rechercher des organisations
router.get('/filter', function(req, res, next) {
  const filter = req.query.filter;
  const value = req.query.value;
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;
  const search = req.query.search;

  let queryFunction;
  let title;

  switch (filter) {
    case 'siren':
      queryFunction = organisationModel.readBySiren;
      title = 'Liste des organisations par SIREN';
      break;
    case 'nom':
      queryFunction = organisationModel.readByNom;
      title = 'Liste des organisations par nom';
      break
      case 'type':
        queryFunction = organisationModel.readByType;
        title = 'Liste des organisations par type';
        break;
      case 'siege_social':
        queryFunction = organisationModel.readBySiegeSocial;
        title = 'Liste des organisations par siège social';
        break;
      default:
        queryFunction = organisationModel.search;
        title = 'Liste des organisations';
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
      res.render('organisations', { title: title, organisations: result });
    });
  });
  