const express = require('express');
const router = express.Router();
const offreModel = require('../model/Offre.js');
const utilisateurModel = require('../model/Utilisateur.js');

// Route pour afficher la liste des offres avec recherche, filtre et tri
router.get('/offres', function(req, res, next) {
  const utilisateur = req.session.utilisateur;
  const filter = req.query.filter;
  const value = req.query.value;
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;
  const search = req.query.search;

  let queryFunction;
  let title;

  switch (filter) {
    case 'rattachement':
      queryFunction = offreModel.readByRattachement;
      title = 'Liste des offres par rattachement';
      break;
    case 'etat':
      queryFunction = offreModel.readByEtat;
      title = 'Liste des offres par état';
      break;
    case 'date_publication':
      queryFunction = offreModel.readByDatePublication;
      title = 'Liste des offres par date de publication';
      break;
    case 'date_validite':
      queryFunction = offreModel.readByDateValidite;
      title = 'Liste des offres par date de validité';
      break;
    case 'intitule':
      queryFunction = offreModel.readByIntitule;
      title = 'Liste des offres par intitulé de fiche';
      break;
    case 'organisation':
      queryFunction = offreModel.readByOrganisation;
      title = 'Liste des offres par organisation de fiche';
      break;
    case 'statut_poste':
      queryFunction = offreModel.readByStatutPoste;
      title = 'Liste des offres par statut de poste de fiche';
      break;
    case 'lieu_mission':
      queryFunction = offreModel.readByLieuMission;
      title = 'Liste des offres par lieu de mission de fiche';
      break;
    case 'fourchette':
      queryFunction = offreModel.readByFourchette;
      title = 'Liste des offres par fourchette de salaire de fiche';
      break;
    case 'rythme':
      queryFunction = offreModel.readByRythme;
      title = 'Liste des offres par rythme de fiche';
      break;
    default:
      queryFunction = offreModel.search;
      title = 'Liste des offres';
      break;
  }

  if (utilisateur.type_compte === 2) {
    // Si l'utilisateur est un recruteur, limiter les résultats à son organisation
    utilisateurModel.readOrganisation(utilisateur.id, function(err, result) {
      if (err) {
        return res.status(500).send("Erreur lors de la récupération de l'organisation de l'utilisateur.");
      }
      const organisation = result[0].organisation;

      queryFunction(value || search, organisation, function(err, result) {
        if (err) {
          return res.status(500).send("Erreur lors de la récupération des offres.");
        }
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
        res.render('offres', { title: title, offres: result });
      });
    });
  } else if (utilisateur.type_compte === 0) {
    // Admin peut voir toutes les offres
    queryFunction(value || search, function(err, result) {
      if (err) {
        return res.status(500).send("Erreur lors de la récupération des offres.");
      }
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
      res.render('offres', { title: title, offres: result });
    });
  } else {
    // Utilisateur classique ne voit que les offres non expirées
    offreModel.readAllNonExpirees(function(err, result) {
      if (err) {
        return res.status(500).send("Erreur lors de la récupération des offres.");
      }
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
      res.render('offres', { title: title, offres: result });
    });
  }
});

// Anciennes routes pour les utilisateurs et les offres

// Route pour afficher la liste des utilisateurs
router.get('/utilisateurs', function(req, res, next) {
  utilisateurModel.readAll(function(err, result) {
    if (err) {
      return res.status(500).send("Erreur lors de la récupération des utilisateurs.");
    }
    res.render('utilisateurs', { title: 'Liste des utilisateurs', utilisateurs: result });
  });
});

// Route pour afficher une offre spécifique
router.get('/offres/:numOffre', function(req, res, next) {
  const numOffre = req.params.numOffre;
  offreModel.read(numOffre, function(err, result) {
    if (err) {
      return res.status(500).send("Erreur lors de la récupération de l'offre.");
    }
    res.render('offre', { title: 'Détail de l\'offre', offre: result[0] });
  });
});

// Route pour créer une nouvelle offre
router.post('/offres', function(req, res, next) {
  const { numOffre, fiche, actif, datePublication, dateValidite, indications, listePieces, nombrePieces } = req.body;
  offreModel.create(numOffre, fiche, actif, datePublication, dateValidite, indications, listePieces, nombrePieces, function(success) {
    if (success) {
      res.redirect('/offres');
    } else {
      res.status(500).send("Erreur lors de la création de l'offre.");
    }
  });
});

// Route pour mettre à jour une offre
router.put('/offres/:numOffre', function(req, res, next) {
  const numOffre = req.params.numOffre;
  const { fiche, actif, datePublication, dateValidite, indications, listePieces, nombrePieces } = req.body;
  offreModel.update(numOffre, fiche, actif, datePublication, dateValidite, indications, listePieces, nombrePieces, function(success) {
    if (success) {
      res.redirect('/offres/' + numOffre);
    } else {
      res.status(500).send("Erreur lors de la mise à jour de l'offre.");
    }
  });
});

// Route pour supprimer une offre
router.delete('/offres/:numOffre', function(req, res, next) {
  const numOffre = req.params.numOffre;
  offreModel.delete(numOffre, function(success) {
    if (success) {
      res.redirect('/offres');
    } else {
      res.status(500).send("Erreur lors de la suppression de l'offre.");
    }
  });
});

// Route pour rechercher des offres
router.get('/recherche', function(req, res, next) {
  const query = req.query.q;
  const utilisateur = req.session.utilisateur;

  if (utilisateur.type_compte === 2) {
    // Si l'utilisateur est un recruteur, limiter les résultats à son organisation
    utilisateurModel.readOrganisation(utilisateur.id, function(err, result) {
      if (err) {
        return res.status(500).send("Erreur lors de la récupération de l'organisation de l'utilisateur.");
      }
      const organisation = result[0].organisation;

      offreModel.search(query, organisation, function(err, result) {
        if (err) {
          return res.status(500).send("Erreur lors de la recherche des offres.");
        }
        res.render('offres', { title: 'Résultats de recherche', offres: result });
      });
    });
  } else if (utilisateur.type_compte === 0) {
    // Admin peut voir toutes les offres
    offreModel.search(query, function(err, result) {
      if (err) {
        return res.status(500).send("Erreur lors de la recherche des offres.");
      }
      res.render('offres', { title: 'Résultats de recherche', offres: result });
    });
  } else {
    // Utilisateur classique ne voit que les offres non expirées
    offreModel.readAllNonExpirees(function(err, result) {
      if (err) {
        return res.status(500).send("Erreur lors de la récupération des offres.");
      }
      const filteredResults = result.filter(offre => {
        return offre.numero_offre.includes(query) || offre.indications.includes(query);
      });
      res.render('offres', { title: 'Résultats de recherche', offres: filteredResults });
    });
  }
});

module.exports = router;
