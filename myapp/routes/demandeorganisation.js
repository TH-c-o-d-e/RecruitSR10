var express = require('express');
var router = express.Router();
const demandeOrganisationModel = require('../model/DemandeOrganisation.js');

/* GET all demandes, with optional filtering, sorting, and searching */
router.get('/demandeslist', function (req, res, next) {
  const filter = req.query.filter;
  const value = req.query.value;
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;
  const search = req.query.search;

  if (search) {
    demandeOrganisationModel.search(search, function (err, result) {
      if (err) {
        res.status(500).send("Erreur lors de la recherche des demandes.");
      } else {
        res.render('demandesList', { title: 'Liste des demandes', demandes: result });
      }
    });
  } else if (filter && value) {
    let queryFunction;
    let title;

    switch (filter) {
      case 'demandeur':
        queryFunction = demandeOrganisationModel.readByDemandeur;
        title = 'Liste des demandes par demandeur';
        break;
      case 'date':
        queryFunction = demandeOrganisationModel.readByDate;
        title = 'Liste des demandes par date';
        break;
      default:
        res.status(400).send('Filtre non valide');
        return;
    }

    queryFunction(value, function (err, result) {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des demandes.");
      } else {
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
        res.render('demandesList', { title: title, demandes: result });
      }
    });
  } else {
    demandeOrganisationModel.readAll(function (err, result) {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des demandes.");
      } else {
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
        }
        res.render('demandesList', { title: 'Liste des demandes', demandes: result });
      }
    });
  }
});

/* Update a demande */
router.put('/editdemande', function (req, res, next) {
  const { demandeur, date, siren, nom, type, siege_social } = req.body;
  demandeOrganisationModel.update(demandeur, date, siren, nom, type, siege_social, function (err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la mise à jour de la demande.");
    } else if (success) {
      res.send("Mise à jour de la demande réussie.");
    } else {
      res.status(404).send("La demande n'a pas été trouvée.");
    }
  });
});

/* Create a new demande */
router.post('/createdemande', function (req, res, next) {
  const { demandeur, date, siren, nom, type, siege_social } = req.body;
  demandeOrganisationModel.create(demandeur, date, siren, nom, type, siege_social, function (err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la création de la demande.");
    } else {
      res.redirect("/demandeslist");
    }
  });
});

/* Delete a demande */
router.delete('/deletedemande', function (req, res, next) {
  const { demandeur } = req.body;
  demandeOrganisationModel.delete(demandeur, function (err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de la demande.");
    } else if (success) {
      res.send("Suppression réussie.");
    } else {
      res.status(404).send("La demande n'a pas été trouvée.");
    }
  });
});

/* GET demandes by demandeur */
router.get('/demandesbydemandeur/:demandeur', function (req, res, next) {
  const demandeur = req.params.demandeur;
  demandeOrganisationModel.readByDemandeur(demandeur, function (err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des demandes.");
    } else {
      res.render('demandesList', { title: 'Liste des demandes par demandeur', demandes: result });
    }
  });
});

/* GET demandes by date */
router.get('/demandesbydate/:date', function (req, res, next) {
  const date = req.params.date;
  demandeOrganisationModel.readByDate(date, function (err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des demandes.");
    } else {
      res.render('demandesList', { title: 'Liste des demandes par date', demandes: result });
    }
  });
});

/* GET demandes listing sorted */
router.get('/demandeslist/sort/:sortBy/:sortOrder', function (req, res, next) {
  const sortBy = req.params.sortBy;
  const sortOrder = req.params.sortOrder;

  demandeOrganisationModel.readAllSorted(sortBy, sortOrder, function (err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des demandes.");
    } else {
      res.render('demandesList', { title: 'Liste des demandes triées par ' + sortBy, demandes: result });
    }
  });
});

module.exports = router;
