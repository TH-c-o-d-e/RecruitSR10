var express = require('express');
var router = express.Router();
const userModel = require('../model/Utilisateur.js');
const nodemailer = require("nodemailer")

/* GET users listing. 
router.get('/userslist', function (req, res, next) {
  userModel.readAll(function (result) {
    res.render('usersList', { title: 'Liste des utilisateurs', users: result });
  });
});*/

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

  userModel.read(id, function (err, result) {
    if (err) {
      res.status(500).send("Erreur lors de la récupération de l'utilisateur.");
    } else if (result.length === 0) {
      res.status(404).send("L'utilisateur n'a pas été trouvé.");
    } else {
      const ancien_type_compte = result[0].type_compte;

      userModel.update(id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, function (err, success) {
        if (err) {
          res.status(500).send("Erreur lors de la mise à jour de l'utilisateur.");
        } else if (success) {
          if (type_compte !== ancien_type_compte) {
            // Le type de compte a changé, envoyer un mail
            const transporter = nodemailer.createTransport({
              // Configuration du transporteur de mail
            });

            const mailOptions = {
              from: 'noreply@example.com',
              to: email,
              subject: 'Votre type de compte a changé',
              text: `Bonjour ${prenom},\n\nVotre type de compte a été changé de ${ancien_type_compte} à ${type_compte}.\n\nCordialement,\nL'équipe de notre site`
            };

            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }

          res.send("Mise à jour de l'utilisateur réussie.");
        } else {        }
      });
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
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'logUTC',
          pass: 'MOTDEPASSEUTC'
        }
      });

      const mailOptions = {
        from: 'MAIL UTC',
        to: email,
        subject: 'Bienvenue sur notre site',
        text: 'Bonjour ' + newUser.nom + ',\n\nBienvenue sur notre site. Nous sommes ravis de vous compter parmi nos utilisateurs.\n\nCordialement,\nL équipe de notre site'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

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


/* GET users listing. */
router.get('/userslist', function (req, res, next) {
  const filter = req.query.filter;
  const value = req.query.value;

  let queryFunction;
  let title;

  switch (filter) {
    case 'type_compte':
      queryFunction = userModel.readByTypeCompte;
      title = 'Liste des utilisateurs par type de compte';
      break;
    case 'statut_compte':
      queryFunction = userModel.readByStatutCompte;
      title = 'Liste des utilisateurs par statut de compte';
      break;
    default:
      queryFunction = userModel.readAll;
      title = 'Liste des utilisateurs';
      break;
  }

  queryFunction(value, function (result) {
    res.render('usersList', { title: title, users: result });
  });
});

/* GET users listing sorted */
router.get('/userslist/sort/:sortBy/:sortOrder', function (req, res, next) {
  const sortBy = req.params.sortBy;
  const sortOrder = req.params.sortOrder;

  userModel.readAllSorted(sortBy, sortOrder, function (result) {
    res.render('usersList', { title: 'Liste des utilisateurs triés par ' + sortBy, users: result });
  });
});

/* GET users listing with filter, sort and search */
router.get('/userslist', function (req, res, next) {
  const filter = req.query.filter;
  const value = req.query.value;
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;
  const search = req.query.search;

  let queryFunction;
  let title;

  switch (filter) {
    case 'type_compte':
      queryFunction = userModel.readByTypeCompte;
      title = 'Liste des utilisateurs par type de compte';
      break;
    case 'statut_compte':
      queryFunction = userModel.readByStatutCompte;
      title = 'Liste des utilisateurs par statut de compte';
      break;
    default:
      queryFunction = userModel.search;
      title = 'Liste des utilisateurs';
      break;
  }

  queryFunction(value || search, function (result) {
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
      title += ' triés par ' + sortBy;
    }
    res.render('usersList', { title: title, users: result });
  });
});



// Route pour l'inscription d'un utilisateur
router.post('/inscription', function(req, res, next) {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.email;
  const date_naissance = req.body.date_naissance;
  const telephone = req.body.telephone;
  const mot_de_passe = req.body.mot_de_passe;
  const type_compte = 0;
  const statut_compte = 1;

  // Vérification de la complexité du mot de passe
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  if (!regex.test(mot_de_passe)) {
    req.flash('error', 'Le mot de passe doit comporter au moins 12 caractères, dont des majuscules, des minuscules, des chiffres et des caractères spéciaux parmi @$!%*?&');
    res.redirect('/inscription');
    return;
  }

  utilisateurModel.create(nom, prenom, email, date_naissance, telephone, mot_de_passe, type_compte, statut_compte, function(result) {
    if (result) {
      res.redirect('/utilisateurs');
    } else {
      req.flash('error', 'L\' inscription a échoué !' );
      res.redirect('/inscription')
    }
  });
});


const express = require('express');
const router = express.Router();
const utilisateurModel = require('../models/utilisateur');

// Middleware pour vérifier si l'utilisateur est connecté
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Middleware pour vérifier le type de compte de l'utilisateur
function checkAccountType(type) {
  return function(req, res, next) {
    if (req.session.role === type) {
      return next();
    }
    res.redirect('/');
  }
}

// Route pour la connexion d'un utilisateur
router.post('/login', function(req, res, next) {
  const email = req.body.email;
  const mot_de_passe = req.body.mot_de_passe;

  utilisateurModel.areValid(email, mot_de_passe, function(result) {
    if (result) {
      // Connexion réussie
      req.session.user = result.email;
      req.session.role = result.type_compte;
      if (result.type_compte === 0) {
        res.redirect('/accueil_candidat');
      } else if (result.type_compte === 2) {
        res.redirect('/accueil_recruteur');
      } else if (result.type_compte === 1) {
        res.redirect('/accueil_administrateur');
      }
    } else {
      // Connexion échouée
      req.flash('error', 'Email et/ou mot de passe invalide');
      res.redirect('/login');
    }
  });
});

// Route pour l'accueil candidat
router.get('/accueil_candidat', isAuthenticated, checkAccountType(0), function(req, res, next) {
  // Code pour l'affichage de l'accueil candidat
});

// Route pour l'accueil recruteur
router.get('/accueil_recruteur', isAuthenticated, checkAccountType(2), function(req, res, next) {
  // Code pour l'affichage de l'accueil recruteur
});

// Route pour l'accueil administrateur
router.get('/accueil_administrateur', isAuthenticated, checkAccountType(1), function(req, res, next) {
  // Code pour l'affichage de l'accueil administrateur
});


module.exports = router;