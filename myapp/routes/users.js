var express = require('express');
var router = express.Router();
const DB = require("../model/connexion_bd.js");
const userModel = require('../model/Utilisateur.js'); // Assurez-vous d'importer correctement votre modèle d'utilisateur

/* GET users listing. */
router.get('/userslist', function (req, res, next) {
  userModel.readall(function (result) {
    res.render('usersList', { title: 'Liste des utilisateurs', users: result });
  });
});

module.exports = router;