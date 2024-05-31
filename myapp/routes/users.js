var express = require('express');
var router = express.Router();
const DB = require("../model/connexion_bd.js");
const userModel = require('../model/Utilisateur.js'); // Assurez-vous d'importer correctement votre modèle d'utilisateur

/* GET users listing. */
router.get('/userslist', function (req, res, next) {
  userModel.readAll(function (result) {
    res.render('usersList', { title: 'Liste des utilisateurs', users: result });
  });
});

/* On met à jour un utilisateur */
router.put('/edituser', function (req, res, next) {
  const email = req.body.email;
  const newValues = req.body;
  userModel.updateUser(email, newValues, function (err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la mise à jour de l'utilisateur.");
    } else if (success) {
      res.send("Mise à jour de l'utilisateur réussie.");
    } else {
      res.status(404).send("L'utilisateur n'a pas été trouvé.");
    }
  });
});

/* On crée un utilisateur */
router.post('/createuser', function(req, res, next) {
  const newUser = req.body;
  userModel.alreadyExists(newUser.email, function(err, exists) {
    if (err) {
      res.status(500).send("Erreur lors de la vérification de l'existence de l'utilisateur.");
    } else if (exists) {
      res.status(401).send("L'utilisateur existe déjà \n");
    } else {
      userModel.create(newUser, function(err, result) {
        if (err) {
          res.status(500).send("Erreur lors de la création de l'utilisateur.");
        } else {
          res.redirect("/userslist");
        }
      });
    }
  });
});

/* On supprime un utilisateur */
router.delete('/deleteuser', function (req, res, next) {
  const email = req.body.email;
  userModel.deleteUser(email, function(err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de l'utilisateur.");
    } else if (success) {
      res.send("Suppression réussie.");
    } else {
      res.status(404).send("L'utilisateur n'a pas été trouvé.");
    }
  });
});

module.exports = router;
