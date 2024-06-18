const express = require('express');
const router = express.Router();
const utilisateurModel = require('../model/Utilisateur.js');

router.get('/', function(req, res, next) {
  const utilisateurId = req.query.id; // Capturer l'ID de l'utilisateur depuis les paramètres de requête

  if (!utilisateurId) {
    return res.status(400).send('Missing user ID');
  }

  // Récupérer l'utilisateur depuis le modèle
  utilisateurModel.read(utilisateurId, function(err, user) {
    if (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', err);
      return res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
    }

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    // Rendre la vue pour modifier l'utilisateur avec les données récupérées
    res.render('modifier_utilisateur', { user: user });
  });
});



router.post('/:id', function(req, res, next) {
    const utilisateurId = req.params.id;
    const { nom, prenom, email, coordonnees, role, statut_compte } = req.body;
  
    utilisateurModel.read(utilisateurId, function(err, user) {
      if (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', err);
        return res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
      }
  
      if (!user) {
        return res.status(404).send('Utilisateur non trouvé');
      }
  
      // Convertir role en type correspondant
      let type;
      console.log("", role);
      if (role === 'utilisateur') {
        type = 1; // Utilisateur
      } else if (role === 'administrateur') {
        type = 0; // Administrateur
      } else if (role === 'recruteur') {
        type = 2; // Recruteur
      } else {
        return res.status(400).send('Rôle invalide');
      }
  
      // Assurez-vous que statut_compte est une valeur valide (1 pour actif, 0 pour inactif, par exemple)
      if (statut_compte !== '1' && statut_compte !== '0') {
        return res.status(400).send('Statut du compte invalide');
      }
  
      // Mettre à jour l'utilisateur en incluant type et statut_compte
      utilisateurModel.update(utilisateurId, email, user.mot_de_passe, prenom, nom, coordonnees, statut_compte, type, null, function(success) {
        if (success) {
          res.redirect('/gestion_utilisateurs?msg=Utilisateur mis à jour avec succès');
        } else {
          res.redirect(`/modifier_utilisateur/${utilisateurId}?msg=Erreur lors de la mise à jour de l'utilisateur`);
        }
      });
    });
  });
  
  
  
  module.exports = router;