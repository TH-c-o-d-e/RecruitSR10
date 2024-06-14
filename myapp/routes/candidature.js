var express = require('express');
var router = express.Router();
const candidatureModel = require('../model/Candidature.js');

/* GET all candidatures, with optional filtering, sorting, and searching */
router.get('/candidatureslist', function (req, res, next) {
  const filter = req.query.filter;
  const value = req.query.value;
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;
  const search = req.query.search;

  if (search) {
    candidatureModel.search(search, function (err, result) {
      if (err) {
        res.status(500).send("Erreur lors de la recherche des candidatures.");
      } else {
        res.render('candidaturesList', { title: 'Liste des candidatures', candidatures: result });
      }
    });
  } else if (filter && value) {
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

    queryFunction(value, function (err, result) {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des candidatures.");
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
        res.render('candidaturesList', { title: title, candidatures: result });
      }
    });
  } else {
    candidatureModel.readAll(function (err, result) {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des candidatures.");
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
        res.render('candidaturesList', { title: 'Liste des candidatures', candidatures: result });
      }
    });
  }
});

/* Update a candidature */
router.put('/editcandidature', function (req, res, next) {
  const { offre, candidat, date, pieces } = req.body;
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

/* Create a new candidature */
router.post('/createcandidature', function (req, res, next) {
  const { offre, candidat, date, pieces } = req.body;
  candidatureModel.create(offre, candidat, date, pieces, function (err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la création de la candidature.");
    } else {
      res.redirect("/candidatureslist");
    }
  });
});

/* Delete a candidature */
router.delete('/deletecandidature', function (req, res, next) {
  const { offre, candidat } = req.body;
  candidatureModel.delete(offre, candidat, function (err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de la candidature.");
    } else if (success) {
      res.send("Suppression réussie.");
    } else {
      res.status(404).send("La candidature n'a pas été trouvée.");
    }
  });
});


// Valider une candidature
router.put('/valider', (req, res) => {
  const { offre, candidat } = req.body;

  // Supprimer la candidature validée
  candidatureModel.delete(offre, candidat, (deleted) => {
    if (!deleted) {
      return res.status(404).send("La candidature n'a pas été trouvée.");
    }

    // Récupérer les informations de la candidature pour envoyer un email au candidat
    userModel.getUserById(candidat, (err, candidatInfo) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erreur lors de la récupération des informations du candidat.");
      }

      // Envoyer un email au candidat
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'votre_email@gmail.com', // Remplacez par votre adresse email
          pass: 'votre_mot_de_passe'     // Remplacez par votre mot de passe
        }
      });

      const mailOptions = {
        from: 'votre_email@gmail.com',   // Remplacez par votre adresse email
        to: candidatInfo.email,          // Email du candidat
        subject: 'Votre candidature a été validée',
        text: `Bonjour ${candidatInfo.prenom},\n\nVotre candidature a été validée pour l'offre numéro ${offre}.\n\nCordialement,\nL'équipe de notre site`
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
          return res.status(500).send("Erreur lors de l'envoi de l'email.");
        }
        console.log('Email sent: ' + info.response);
        res.send("Candidature validée avec succès.");
      });
    });
  });
});

// Refuser une candidature
router.put('/refuser', (req, res) => {
  const { offre, candidat } = req.body;

  // Supprimer la candidature refusée
  candidatureModel.delete(offre, candidat, (deleted) => {
    if (!deleted) {
      return res.status(404).send("La candidature n'a pas été trouvée.");
    }

    // Récupérer les informations de la candidature pour envoyer un email au candidat
    userModel.getUserById(candidat, (err, candidatInfo) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erreur lors de la récupération des informations du candidat.");
      }

      // Envoyer un email au candidat
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'votre_email@gmail.com', // Remplacez par votre adresse email
          pass: 'votre_mot_de_passe'     // Remplacez par votre mot de passe
        }
      });

      const mailOptions = {
        from: 'votre_email@gmail.com',   // Remplacez par votre adresse email
        to: candidatInfo.email,          // Email du candidat
        subject: 'Votre candidature a été refusée',
        text: `Bonjour ${candidatInfo.prenom},\n\nVotre candidature pour l'offre numéro ${offre} a malheureusement été refusée.\n\nCordialement,\nL'équipe de notre site`
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
          return res.status(500).send("Erreur lors de l'envoi de l'email.");
        }
        console.log('Email sent: ' + info.response);
        res.send("Candidature refusée avec succès.");
      });
    });
  });
});
module.exports = router;
