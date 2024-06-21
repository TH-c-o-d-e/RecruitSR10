const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Pour générer des noms de fichiers uniques
const db = require('./connexion_bd.js'); // Importez votre module de connexion à la base de données

// Configurer Multer pour gérer le téléchargement des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const candidatId = req.session.candidatId; // Récupérer l'id du candidat depuis la session
        const offreId = req.body.offreId;
        const uploadPath = `./uploads/${candidatId}/${offreId}`;

        // Créer le dossier de téléchargement si nécessaire
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Générer un nom de fichier unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/candidater', (req, res, next) => {const candidatId = req.session.candidatId;
    res.render('candidater', { candidatId }); // Rendre la vue candidater.ejs avec les données nécessaires
  });

// Route POST pour traiter le dépôt des pièces jointes
router.post('/', upload.fields([
    { name: 'piece1', maxCount: 1 },
    { name: 'piece2', maxCount: 1 },
    { name: 'piece3', maxCount: 1 },
    { name: 'piece4', maxCount: 1 }
]), (req, res, next) => {
    // Récupérer les informations nécessaires pour enregistrer les pièces jointes dans la base de données
    const candidatId = req.session.candidatId;
    const offreId = req.body.offreId;

    // Traiter les fichiers téléchargés
    const pieces = [];

    for (let i = 1; i <= 4; i++) {
        const file = req.files[`piece${i}`];
        if (file && file.length > 0) {
            const filePath = file[0].path;
            pieces.push(filePath);
        }
    }

    // Insérer les chemins des pièces dans la base de données
    const piecesString = pieces.join(';'); // Par exemple, concaténez les chemins avec un délimiteur

    const sql = "INSERT INTO Candidature (offre, Candidat, pieces) VALUES (?, ?, ?)";
    db.query(sql, [offreId, candidatId, piecesString], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'enregistrement des pièces dans la base de données:', err);
            return res.status(500).send('Erreur lors de l\'enregistrement des pièces dans la base de données');
        }

        res.send('Les pièces ont été téléchargées et enregistrées avec succès.');
    });
});

module.exports = router;
