const express = require('express');
const router = express.Router();
const DemandeOrganisation = require('../model/DemandeOrganisation');
const Utilisateur = require('../model/Utilisateur');
const Organisation = require('../model/Organisation');

// Route pour afficher toutes les demandes d'organisation
router.get('/', function(req, res, next) {
  DemandeOrganisation.readAll(function(err, demandes) {
    if (err) {
      console.error('Error fetching demandes:', err);
      return res.status(500).send('Erreur du serveur');
    }
    res.render('gestion_demande_organisation', { demandes: demandes });
  });
});

// Route pour valider une demande d'organisation
router.post('/valider-organisation/:demandeur', function(req, res, next) {
  const demandeur = req.params.demandeur;

  // Lire la demande d'organisation
  DemandeOrganisation.readByDemandeur(demandeur, function(err, demande) {
    if (err) {
      console.error('Error reading demande by demandeur:', err);
      return res.status(500).send('Erreur du serveur');
    }

    if (demande.length === 0) {
      return res.status(404).send('Demande non trouvée');
    }

    const { siren, nom, type, siege_social } = demande[0];

    // Créer l'organisation
    Organisation.create(siren, nom, type, siege_social, function(err, success) {
      if (err) {
        console.error('Error creating organisation:', err);
        return res.status(500).send('Erreur du serveur');
      }

      if (!success) {
        return res.status(500).send('Échec de la création de l\'organisation');
      }

      // Mettre à jour l'utilisateur
      Utilisateur.read(demandeur, function(err, user) {
        if (err) {
          console.error('Error reading utilisateur:', err);
          return res.status(500).send('Erreur du serveur');
        }

        if (user.length === 0) {
          return res.status(404).send('Utilisateur non trouvé');
        }

        const { email, mot_de_passe, prenom, nom, coordonnees, statut_du_compte } = user[0];

        Utilisateur.update(demandeur, email, mot_de_passe, prenom, nom, coordonnees, statut_du_compte, 2, siren, function(err, success) {
          if (err) {
            console.error('Error updating utilisateur:', err);
            return res.status(500).send('Erreur du serveur');
          }

          if (!success) {
            return res.status(500).send('Échec de la mise à jour de l\'utilisateur');
          }

          // Supprimer la demande
          DemandeOrganisation.delete(demandeur, function(err, success) {
            if (err) {
              console.error('Error deleting demande:', err);
              return res.status(500).send('Erreur du serveur');
            }

            if (!success) {
              return res.status(500).send('Échec de la suppression de la demande');
            }

            res.redirect('/gestion_demande_organisation');
          });
        });
      });
    });
  });
});

// Route pour refuser une demande d'organisation
router.post('/refuser-organisation/:demandeur', function(req, res, next) {
  const demandeur = req.params.demandeur;

  DemandeOrganisation.delete(demandeur, function(err, success) {
    if (err) {
      console.error('Error deleting demande:', err);
      return res.status(500).send('Erreur du serveur');
    }

    if (!success) {
      return res.status(500).send('Échec de la suppression de la demande');
    }

    res.redirect('/gestion_demande_organisation');
  });
});

module.exports = router;
