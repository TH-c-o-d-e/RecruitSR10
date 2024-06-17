var express = require('express');
var router = express.Router();
const candidatureModel = require('../../model/Candidature.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver')
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

const app = express();

// Configuration de Multer pour gérer les téléchargements de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const candidatFolder = path.join(__dirname, 'uploads', req.user.id.toString());
    const candidatureFolder = path.join(candidatFolder, req.body.offre.toString());
    
    // Créer les dossiers s'ils n'existent pas déjà
    if (!fs.existsSync(candidatFolder)) {
      fs.mkdirSync(candidatFolder);
    }
    if (!fs.existsSync(candidatureFolder)) {
      fs.mkdirSync(candidatureFolder);
    }
    
    cb(null, candidatureFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Utiliser le nom original du fichier
  }
});

const upload = multer({ storage: storage });

// Middleware pour parser les données POST
app.use(express.urlencoded({ extended: true }));

// Exemple de route pour télécharger les pièces
app.post('/upload', upload.array('pieces'), function(req, res) {
  res.send('Téléchargement des pièces réussi.');
});

// Port d'écoute du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

// Route pour télécharger toutes les pièces d'une candidature
router.get('/candidature/:id/download', function(req, res, next) {
  const candidatureId = req.params.id;

  candidatureModel.downloadAllPieces(candidatureId, function(err, filePaths) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors du téléchargement des fichiers.' });
    }

    if (!filePaths || filePaths.length === 0) {
      return res.status(404).json({ error: 'Aucun fichier trouvé pour cette candidature.' });
    }

    const zipFileName = 'candidature_' + candidatureId + '_pieces.zip';
    const zipPath = path.join(__dirname, '..', 'public', 'downloads', zipFileName);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Compression maximale
    });

    output.on('close', function() {
      res.download(zipPath, zipFileName, function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erreur lors du téléchargement du fichier zip.' });
        }

        // Supprimer le fichier zip après le téléchargement
        fs.unlinkSync(zipPath);
      });
    });

    archive.on('error', function(err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la création du fichier zip.' });
    });

    archive.pipe(output);

    // Ajouter chaque fichier au zip
    for (let filePath of filePaths) {
      const fileName = path.basename(filePath);
      archive.append(fs.createReadStream(filePath), { name: fileName });
    }

    archive.finalize();
  });
});

module.exports = router;
