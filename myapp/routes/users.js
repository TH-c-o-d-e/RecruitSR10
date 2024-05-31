var express = require('express');
var router = express.Router();
const userModel = require('../model/Utilisateur.js');

/* GET users listing. */
router.get('/userslist', function (req, res, next) {
  userModel.readAll(function (result) {
    res.render('usersList', { title: 'Liste des utilisateurs', users: result });
  });
});

/* On met à jour un utilisateur */
router.put('/edituser', function (req, res, next) {
  const id = req.body.id;
  const email = req.body.email;
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const mot_de_passe = req.body.mot_de_passe;
  const type_compte = req.body.type_compte;
  const telephone = req.body.telephone;
  const adresse = req.body.adresse;
  const code_postal = req.body.code_postal;
  const ville = req.body.ville;
  userModel.update(id, email, nom, prenom, mot_de_passe, type_compte, telephone, adresse, code_postal, ville, function (err, success) {
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
  const email = req.body.email;
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const mot_de_passe = req.body.mot_de_passe;
  const type_compte = req.body.type_compte;
  const telephone = req.body.telephone;
  const adresse = req.body.adresse;
  const code_postal = req.body.code_postal;
  const ville = req.body.ville;
  userModel.alreadyExists(email, function(err, exists) {
    if (err) {
      res.status(500).send("Erreur lors de la vérification de l'existence de l'utilisateur.");
    } else if (exists) {
      res.status(401).send("L'utilisateur existe déjà \n");
    } else {
      userModel.create(email, nom, prenom, mot_de_passe, type_compte, telephone, adresse, code_postal, ville, function(err, result) {
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
  const id = req.body.id;
  userModel.delete(id, function(err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de l'utilisateur.");
    } else if (success) {
      res.send("Suppression réussie.");
    } else {
      res.status(404).send("L'utilisateur n'a pas été trouvé.");
    }
  });
});

/* On change le type de compte d'un utilisateur */
router.put('/changeusertype', function (req, res, next) {
  const id = req.body.id;
  const newTypeCompte = req.body.type_compte;
  userModel.updateTypeCompte(id, newTypeCompte, function (err, success) {
    if (err) {
      res.status(500).send("Erreur lors de la mise à jour du type de compte de l'utilisateur.");
    } else if (success) {
      res.send("Mise à jour du type de compte de l'utilisateur réussie.");
    } else {
      res.status(404).send("L'utilisateur n'a pas été trouvé.");
    }
  });
});

module.exports = router;
