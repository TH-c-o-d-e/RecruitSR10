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
  const mot_de_passe = req.body.mot_de_passe;
  const prenom = req.body.prenom;
  const nom = req.body.nom;
  const coordonnees = req.body.coordonnees;
  const statut_compte = req.body.statut_compte;
  const type_compte = req.body.type_compte;
  const organisation = req.body.organisation;
  userModel.update(id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, function (err, success) {
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
  const id = req.body.id;
  const email = req.body.email;
  const mot_de_passe = req.body.mot_de_passe;
  const prenom = req.body.prenom;
  const nom = req.body.nom;
  const coordonnees = req.body.coordonnees;
  const statut_compte = req.body.statut_compte;
  const type_compte = req.body.type_compte;
  const organisation = req.body.organisation;
  userModel.create(id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, function(err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la création de l'utilisateur.");
    } else {
      res.redirect("/userslist");
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

/* On vérifie les identifiants d'un utilisateur */
router.post('/login', function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  userModel.areValid(email, password, function (isValid) {
    if (isValid) {
      res.send("Identifiants valides.");
    } else {
      res.status(401).send("Identifiants invalides.");
    }
  });
});

/* GET users by type_compte */
router.get('/usersbytypecompte/:type_compte', function (req, res, next) {
  const type_compte = req.params.type_compte;
  userModel.readByTypeCompte(type_compte, function (result) {
    res.render('usersList', { title: 'Liste des utilisateurs par type de compte', users: result });
  });
});

/* GET users by statut_compte */
router.get('/usersbystatutcompte/:statut_compte', function (req, res, next) {
  const statut_compte = req.params.statut_compte;
  userModel.readByStatutCompte(statut_compte, function (result) {
    res.render('usersList', { title: 'Liste des utilisateurs par statut de compte', users: result });
  });
});
