var express = require('express');
var router = express.Router();
const candidatureModel = require('../model/Candidature.js');

/* /* GET candidatures listing. 
router.get('/candidatureslist', function (req, res, next) {
  candidatureModel.readAll(function (result) {
    res.render('candidaturesList', { title: 'Liste des candidatures', candidatures: result });
  });
}); 
 */
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

/* GET candidatures by filter */
router.get('/candidaturesbyfilter/:filter/:value', function (req, res, next) {
  const filter = req.params.filter;
  const value = req.params.value;

  let queryFunction;
  let title;

  switch (filter) {
    case 'offre':
      queryFunction = candidatureModel.readByOffre;
      title = 'Liste des candidatures par offre';
      break;
    case 'candidat':
      queryFunction = candidatureModel.readByCandidat;
      title = 'Liste des candidatures par candidat';
      break;
    case 'date':
      queryFunction = candidatureModel.readByDate;
      title = 'Liste des candidatures par date';
      break;
    default:
      res.status(400).send('Filtre non valide');
      return;
  }

  queryFunction(value, function (result) {
    res.render('candidaturesList', { title: title, candidatures: result });
  });
});

/* GET candidatures listing sorted */
router.get('/candidatureslist/sort/:sortBy/:sortOrder', function (req, res, next) {
  const sortBy = req.params.sortBy;
  const sortOrder = req.params.sortOrder;

  candidatureModel.readAllSorted(sortBy, sortOrder, function (result) {
    res.render('candidaturesList', { title: 'Liste des candidatures triées par ' + sortBy, candidatures: result });
  });
});

/* GET candidatures listing with filter, sort and search */
router.get('/candidatureslist', function (req, res, next) {
  const filter = req.query.filter;
  const value = req.query.value;
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;
  const search = req.query.search;

  let queryFunction;
  let title;

  switch (filter) {
    case 'offre':
      queryFunction = candidatureModel.readByOffre;
      title = 'Liste des candidatures par offre';
      break;
    case 'candidat':
      queryFunction = candidatureModel.readByCandidat;
      title = 'Liste des candidatures par candidat';
      break;
    case 'date':
      queryFunction = candidatureModel.readByDate;
      title = 'Liste des candidatures par date';
      break;
    default:
      queryFunction = candidatureModel.search;
      title = 'Liste des candidatures';
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
    res.render('candidaturesList', { title: title, candidatures: result });
  });
});




module.exports = router;
