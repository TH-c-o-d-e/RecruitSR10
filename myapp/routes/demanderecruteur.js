const express = require('express');
var router = express.Router();
const demandeRecruteurModel = require('../model/DemandeRecruteur');
const organisationModel = require("../model/Organisation");

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

router.post('/demande-recruteur', function(req, res, next) {
  const { siren } = req.body; // Récupérer le numéro de SIREN depuis le formulaire

  // Vérifier si l'organisation existe dans la base de données
  organisationModel.getBySiren(siren, function(err, organisation) {
    if (err) {
      console.error("Erreur lors de la vérification de l'organisation :", err);
      return res.status(500).json({ message: "Erreur lors de la vérification de l'organisation." });
    }

    if (!organisation) {
      return res.redirect('/demande-organisation'); // Rediriger vers la page de demande d'organisation
    }

    // Créer une demande dans la table DemandeRecruteur
    demandeRecruteurModel.create({
      demandeur: req.session.userid, // Supposant que req.session.userid contient l'identifiant de l'utilisateur connecté
      organisation: organisation.siren
    }, function(err, demande) {
      if (err) {
        console.error("Erreur lors de la création de la demande de recruteur :", err);
        return res.status(500).json({ message: "Erreur lors de la création de la demande de recruteur." });
      }
      res.status(200).json({ message: "Demande de recruteur soumise avec succès." });
    });

  });
});

// Route pour rediriger vers la page de demande d'organisation
router.get('/demande-organisation', function(req, res) {
  res.render('demandeOrganisation', { title: 'Demande d\'organisation' });
});