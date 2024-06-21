const express = require('express');
const router = express.Router();
const FicheModel = require('../model/Fiche'); // Assurez-vous que le chemin est correct

// Route pour afficher le formulaire de création d'une nouvelle fiche de poste
router.get('/nouvelle', (req, res) => {
    res.render('formulaire_ficheposte');
  });
  
  router.post('/nouvelle', (req, res) => {
    // Vérifiez si l'utilisateur est connecté et que req.session.user est défini
    if (!req.session.user) {
        return res.status(401).send('Utilisateur non connecté');
    }

    const { intitule, statut, responsable, lieu, rythme, salaire } = req.body;

    const organisation = req.session.user.organisation; // Vérifiez que req.session.user.organisation est défini si nécessaire

    FicheModel.create(intitule, organisation, statut, responsable, lieu, rythme, salaire, (success) => {
        if (success) {
            res.redirect('/accueil_recruteur'); // Redirection après création réussie
        } else {
            res.status(500).send('Erreur lors de la création de la fiche de poste'); // Gestion de l'erreur
        }
    });
});

  router.get('/modifier/:id', (req, res) => {
    const ficheId = req.params.id;
  
    // Utilisez votre modèle pour récupérer les détails de la fiche de poste à modifier
    FicheModel.readById(ficheId, (ficheposte) => {
      if (!ficheposte) {
        res.status(404).send('Fiche de poste non trouvée');
        return;
      }
  
      res.render('modifier_ficheposte', { ficheposte });
    });
  });
  
  // Route pour traiter la modification d'une fiche de poste
  router.post('/modifier/:id', (req, res) => {
    const ficheId = req.params.id;
    const { intitule, statut, responsable, lieu, rythme, salaire } = req.body;
  
    // Utilisez votre modèle pour mettre à jour la fiche de poste
    FicheModel.update(ficheId, intitule, statut, responsable, lieu, rythme, salaire, (success) => {
      if (success) {
        res.redirect('/gestion_ficheposte'); // Redirection après modification réussie
      } else {
        res.status(500).send('Erreur lors de la modification de la fiche de poste'); // Gestion de l'erreur
      }
    });
  });

  router.get('/gestion_fiches_de_poste', (req, res) => {
    // Récupérez la liste des fiches de poste depuis votre modèle
    FicheModel.readAll((fiches) => {
      // Render la vue gestion_fiches_de_poste.ejs avec les données des fiches de poste
      res.render('gestion_fiches_de_poste', { fiche: fiches });
    });
  });

  // Route pour traiter la suppression d'une fiche de poste
router.post('/supprimer/:id', (req, res) => {
    const ficheId = req.params.id;
  
    // Utilisez votre modèle pour supprimer la fiche de poste
    FicheModel.delete(ficheId, (success) => {
      if (success) {
        res.redirect('/gestion_fiches_de_poste'); // Redirection après suppression réussie
      } else {
        res.status(500).send('Erreur lors de la suppression de la fiche de poste'); // Gestion de l'erreur
      }
    });
  });
  
module.exports = router;
