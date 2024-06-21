const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const Candidature = require('../model/Candidature'); // Assurez-vous d'importer correctement le modèle Candidature

// Route GET pour afficher la page gestion_candidatures.ejs
router.get('/gestion_candidatures', (req, res, next) => {
    Candidature.readAll((err, candidatures) => {
        if (err) {
            console.error('Erreur lors de la récupération des candidatures :', err);
            return next(err); // Passer l'erreur au middleware d'erreur suivant
        }
        res.render('gestion_candidatures', { candidatures }); // Rendre la vue gestion_candidatures.ejs avec les données récupérées
    });
});

module.exports = router;

// Route POST pour télécharger le dossier ZIP des pièces jointes
router.post('/telecharger_dossier', (req, res, next) => {
    const candidatureId = req.body.candidatureId; // Récupérer l'ID de la candidature à télécharger depuis le formulaire

    Candidature.downloadAllPieces(candidatureId, (err, pieces) => {
        if (err) {
            console.error('Erreur lors du téléchargement des pièces :', err);
            return res.status(500).send('Erreur lors du téléchargement des pièces.');
        }

        if (!pieces || pieces.length === 0) {
            return res.status(404).send('Aucun fichier trouvé pour cette candidature.');
        }

        const output = fs.createWriteStream(path.join(__dirname, 'dossier_candidature.zip')); // Chemin où sera créé le fichier ZIP
        const archive = archiver('zip', { zlib: { level: 9 } }); // Créer un nouvel archiveur zip

        output.on('close', () => {
            console.log(archive.pointer() + ' total bytes');
            console.log('Dossier ZIP créé avec succès');
            res.download(path.join(__dirname, 'dossier_candidature.zip')); // Télécharger le fichier ZIP
        });

        archive.on('error', (err) => {
            console.error('Erreur lors de la création du dossier ZIP :', err);
            res.status(500).send('Erreur lors de la création du dossier ZIP.');
        });

        // Ajouter chaque pièce jointe à l'archive
        archive.pipe(output);
        pieces.forEach((piece, index) => {
            archive.file(piece, { name: `piece${index + 1}.pdf` }); // Exemple : ajouter chaque pièce en tant que fichier nommé piece1.pdf, piece2.pdf, etc.
        });

        // Finaliser l'archive (termine le processus d'écriture du fichier ZIP)
        archive.finalize();
    });
});

