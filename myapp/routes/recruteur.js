const express = require('express');
const router = express.Router();
const offreModel = require('../model/Offre.js'); // Assurez-vous d'avoir le bon chemin vers votre modèle d'Offre
const ficheModel = require('../model/Fiche.js'); // Assurez-vous d'avoir le bon chemin vers votre modèle de Fiche

// Route pour afficher le formulaire de création d'une nouvelle offre
router.get('/nouvelle_offre', (req, res) => {
  // Récupérer les fiches de poste pour le menu déroulant
  ficheModel.getAll((err, fiches) => {
    if (err) {
      console.error("Erreur lors de la récupération des fiches de poste :", err);
      // Gérer l'erreur (par exemple, rediriger vers une page d'erreur)
      res.redirect('/erreur'); // Remplacez par le chemin de votre page d'erreur
    } else {
      res.render('nouvelle_offre', { fiches }); // Passer les fiches à la vue
    }
  });
});

// Route pour traiter la soumission du formulaire de création d'une nouvelle offre
router.post('/nouvelle_offre', (req, res) => {
  const { fiche_poste, numero_offre, etat, date_validite, indications, liste_pieces, nombre_pieces } = req.body;

  // Créer un objet Offre à partir des données reçues
  const nouvelleOffre = {
    fiche_poste,
    numero_offre,
    etat,
    date_validite,
    indications,
    liste_pieces,
    nombre_pieces
  };

  // Appeler la méthode pour créer une nouvelle offre dans votre modèle
  offreModel.create(nouvelleOffre, (err) => {
    if (err) {
      // Gérer l'erreur (par exemple, afficher un message d'erreur)
      console.error("Erreur lors de la création de l'offre :", err);
      res.redirect('/recruteur/nouvelle_offre'); // Rediriger vers la page du formulaire avec un message d'erreur si nécessaire
    } else {
      // Rediriger vers une autre page ou afficher un message de succès
      res.redirect('/recruteur/gestion_offres'); // Rediriger vers la page de gestion des offres par exemple
    }
  });
});


// Route pour afficher le formulaire de modification d'une offre spécifique
router.get('/modifier_offre/:id', (req, res) => {
  const offreId = req.params.id;

  // Récupérer l'offre spécifique à modifier
  offreModel.read(offreId, (err, offre) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'offre à modifier :", err);
      // Gérer l'erreur (par exemple, rediriger vers une page d'erreur)
      res.redirect('/error'); // Remplacez par le chemin de votre page d'erreur
      return;
    }

    // Récupérer toutes les fiches de poste pour le menu déroulant
    ficheModel.read((err, fiches) => {
      if (err) {
        console.error("Erreur lors de la récupération des fiches de poste :", err);
        // Gérer l'erreur (par exemple, rediriger vers une page d'erreur)
        res.redirect('/erreur'); // Remplacez par le chemin de votre page d'erreur
        return;
      }

      res.render('modifier_offre', { offre, fiches }); // Passer l'offre et les fiches à la vue
    });
  });
});

module.exports = router;

// Route pour traiter la soumission du formulaire de modification d'une offre
router.post('/modifier_offre', (req, res) => {
    const { offre_id, fiche_poste, numero_offre, etat, date_validite, indications, liste_pieces, nombre_pieces } = req.body;
  
    // Vérifiez ici la validité des données reçues si nécessaire
  
    // Créer un objet Offre à partir des données reçues
    const offreModifiee = {
      id: offre_id,
      fiche_poste,
      numero_offre,
      etat,
      date_validite,
      indications,
      liste_pieces,
      nombre_pieces
    };
  
    // Appeler la méthode pour mettre à jour l'offre dans votre modèle
    offreModel.update(offreModifiee, (err) => {
      if (err) {
        // Gérer l'erreur (par exemple, afficher un message d'erreur)
        console.error("Erreur lors de la modification de l'offre :", err);
        res.redirect('/recruteur/modifier_offre'); // Rediriger vers la page du formulaire avec un message d'erreur si nécessaire
      } else {
        // Rediriger vers une autre page ou afficher un message de succès
        res.redirect('/recruteur/gestion_offres'); // Rediriger vers la page de gestion des offres par exemple
      }
    });
  });
  
  module.exports = router;
  
