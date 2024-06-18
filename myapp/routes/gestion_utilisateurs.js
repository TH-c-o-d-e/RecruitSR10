const express = require('express');
const router = express.Router();
const utilisateurModel = require('../model/Utilisateur.js');

router.get('/', function(req, res, next) {
  utilisateurModel.readAll(function(err, users) {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      res.render('gestion_utilisateurs', { error: 'Erreur lors de la récupération des utilisateurs' });
    } else {
      res.render('gestion_utilisateurs', { user: users, error: null }); // Assurez-vous que error est défini
    }
  });
});

// Route pour gérer les actions sur l'utilisateur
router.post('/gerer_utilisateur', function(req, res, next) {
  const choix = req.body.choix;
  const utilisateurId = req.body.utilisateur;

  if (!choix || !utilisateurId) {
    return res.status(400).send('Missing parameters');
  }

  if (choix === 'suppression') {
    // Suppression de l'utilisateur et tous les objets liés
    utilisateurModel.delete(utilisateurId, function(success) {
      if (success) {
        res.redirect('/gestion_utilisateurs?msg=Utilisateur supprimé avec succès');
      } else {
        res.redirect('/gestion_utilisateurs?msg=Erreur lors de la suppression de l\'utilisateur');
      }
    });
  } else if (choix === 'modification') {
    // Redirection vers la page de modification de l'utilisateur
    res.redirect(`/modifier_utilisateur?id=${utilisateurId}`);
  } else if (choix === 'droits_admin') {
    // Mettre à jour le type de l'utilisateur à 0 (droits d'administration)
    utilisateurModel.updateTypeCompte(utilisateurId, 0, function(success) {
      if (success) {
        res.redirect('/gestion_utilisateurs?msg=Droits d\'administration accordés avec succès');
      } else {
        res.redirect('/gestion_utilisateurs?msg=Erreur lors de l\'accord des droits d\'administration');
      }
    });
  } else {
    res.status(400).send('Invalid choice');
  }
});

module.exports = router;
