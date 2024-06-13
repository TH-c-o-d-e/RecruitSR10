var express = require('express');
var router = express.Router();
const ficheModel = require('../model/Fiche.js');

// /* GET fiches listing. */
// router.get('/ficheslist', function (req, res, next) {
//   ficheModel.readAll(function (result) {
//     res.render('fichesList', { title: 'Liste des fiches', fiches: result });
//   });
// });

/* On met à jour une fiche */
router.put('/editfiche', function (req, res, next) {
  const intitule = req.body.intitule;
  const organisation = req.body.organisation;
  const statut_poste = req.body.statut_poste;
  const responsable = req.body.responsable;
  const lieu_mission = req.body.lieu_mission;
  const rythme = req.body.rythme;
  const fourchette = req.body.fourchette;
  ficheModel.update(intitule, organisation, statut_poste, responsable, lieu_mission, rythme, fourchette, function (err, success) {
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
  const intitule = req.body.intitule;
  const organisation = req.body.organisation;
  const statut_poste = req.body.statut_poste;
  const responsable = req.body.responsable;
  const lieu_mission = req.body.lieu_mission;
  const rythme = req.body.rythme;
  const fourchette = req.body.fourchette;
  ficheModel.create(intitule, organisation, statut_poste, responsable, lieu_mission, rythme, fourchette, function(err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la création de la fiche.");
    } else {
      res.redirect("/ficheslist");
    }
  });
});

/* On supprime une fiche */
router.delete('/deletefiche', function (req, res, next) {
  const intitule = req.body.intitule;
  const organisation = req.body.organisation;
  ficheModel.delete(intitule, organisation, function(err, success) {
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

/* GET fiches by statut_poste */
router.get('/fichesbystatutposte/:statut_poste', function (req, res, next) {
  const statut_poste = req.params.statut_poste;
  ficheModel.readByStatutPoste(statut_poste, function (result) {
    res.render('fichesList', { title: 'Liste des fiches par statut de poste', fiches: result });
  });
});

/* GET organisations listing sorted */
router.get('/organisationslist/sort/:sortBy/:sortOrder', function (req, res, next) {
  const sortBy = req.params.sortBy;
  const sortOrder = req.params.sortOrder;

  organisationModel.readAllSorted(sortBy, sortOrder, function (result) {
    res.render('organisationsList', { title: 'Liste des organisations triées par ' + sortBy, organisations: result });
  });
});

/* GET fiches listing with filter, sort and search */
router.get('/ficheslist', function (req, res, next) {
  const filter = req.query.filter;
  const value = req.query.value;
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;
  const search = req.query.search;

  let queryFunction;
  let title;

  switch (filter) {
    case 'intitule':
      queryFunction = ficheModel.readByIntitule;
      title = 'Liste des fiches par intitulé';
      break;
    case 'organisation':
      queryFunction = ficheModel.readByOrganisation;
      title = 'Liste des fiches par organisation';
      break;
    case 'statut_poste':
      queryFunction = ficheModel.readByStatutPoste;
      title = 'Liste des fiches par statut de poste';
      break;
    case 'lieu_mission':
      queryFunction = ficheModel.readByLieuMission;
      title = 'Liste des fiches par lieu de mission';
      break;
    case 'fourchette':
      queryFunction = ficheModel.readByFourchette;
      title = 'Liste des fiches par fourchette de salaire';
      break;
    case 'rythme':
      queryFunction = ficheModel.readByRythme;
      title = 'Liste des fiches par rythme';
      break;
    default:
      queryFunction = ficheModel.search;
      title = 'Liste des fiches';
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
    res.render('fichesList', { title: title, fiches: result });
  });
});

module.exports = router;