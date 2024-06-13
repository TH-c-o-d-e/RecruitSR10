var express = require('express');
var router = express.Router();
const organisationModel = require('../model/Organisation.js');

// /* GET organisations listing. */
// router.get('/organisationslist', function (req, res, next) {
//   organisationModel.readAll(function (result) {
//     res.render('organisationsList', { title: 'Liste des organisations', organisations: result });
//   });
// });

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

/* GET organisations listing with filter, sort and search */
router.get('/organisationslist', function (req, res, next) {
  const filter = req.query.filter;
  const value = req.query.value;
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;
  const search = req.query.search;

  let queryFunction;
  let title;

  switch (filter) {
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

  queryFunction(value || search, function (result) {
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
    res.render('organisationsList', { title: title, organisations: result });
  });
});
 
module.exports = router;