const express = require('express');
const router = express.Router();
const userModel = require('../model/Utilisateur.js');
const nodemailer = require('nodemailer');

// Route pour mettre à jour un utilisateur
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

  userModel.read(id, function (result) {
    if (result.length === 0) {
      res.status(404).send("L'utilisateur n'a pas été trouvé.");
    } else {
      const ancien_type_compte = result[0].type_compte;

      userModel.update(id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, function (success) {
        if (success) {
          if (type_compte !== ancien_type_compte) {
            // Le type de compte a changé, envoyer un mail
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'votre.email@gmail.com',
                pass: 'votre_mot_de_passe'
              }
            });

            const mailOptions = {
              from: 'noreply@example.com',
              to: email,
              subject: 'Votre type de compte a changé',
              text: `Bonjour ${prenom},\n\nVotre type de compte a été changé de ${ancien_type_compte} à ${type_compte}.\n\nCordialement,\nL'équipe de notre site`
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }

          res.send("Mise à jour de l'utilisateur réussie.");
        } else {
          res.status(500).send("Erreur lors de la mise à jour de l'utilisateur.");
        }
      });
    }
  });
});

// Route pour créer un utilisateur
router.post('/createuser', function (req, res, next) {
  const email = req.body.email;
  const mot_de_passe = req.body.mot_de_passe;
  const prenom = req.body.prenom;
  const nom = req.body.nom;
  const coordonnees = req.body.coordonnees;
  const statut_compte = req.body.statut_compte;
  const type_compte = req.body.type_compte;
  const organisation = req.body.organisation;

  userModel.create(email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, function (result) {
    if (result) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'votre.email@gmail.com',
          pass: 'votre_mot_de_passe'
        }
      });

      const mailOptions = {
        from: 'votre.email@gmail.com',
        to: email,
        subject: 'Bienvenue sur notre site',
        text: `Bonjour ${nom},\n\nBienvenue sur notre site. Nous sommes ravis de vous compter parmi nos utilisateurs.\n\nCordialement,\nL'équipe de notre site`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.redirect("/userslist");
    } else {
      res.status(500).send("Erreur lors de la création de l'utilisateur.");
    }
  });
});

// Route pour supprimer un utilisateur
router.delete('/deleteuser', function (req, res, next) {
  const id = req.body.id;
  userModel.delete(id, function (success) {
    if (success) {
      res.send("Suppression réussie.");
    } else {
      res.status(404).send("L'utilisateur n'a pas été trouvé.");
    }
  });
});

// Route pour vérifier les identifiants d'un utilisateur
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

// Route pour obtenir la liste des utilisateurs par type de compte
router.get('/usersbytypecompte/:type_compte', function (req, res, next) {
  const type_compte = req.params.type_compte;
  userModel.readByTypeCompte(type_compte, function (result) {
    res.render('usersList', { title: 'Liste des utilisateurs par type de compte', users: result });
  });
});

// Route pour obtenir la liste des utilisateurs par statut de compte
router.get('/usersbystatutcompte/:statut_compte', function (req, res, next) {
  const statut_compte = req.params.statut_compte;
  userModel.readByStatutCompte(statut_compte, function (result) {
    res.render('usersList', { title: 'Liste des utilisateurs par statut de compte', users: result });
  });
});

// Route pour obtenir la liste des utilisateurs avec filtre, tri et recherche
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
router.post('/inscription', function (req, res, next) {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.email;
  const date_naissance = req.body.date_naissance;
  const telephone = req.body.telephone;
  const mot_de_passe = req.body.mot_de_passe;
  const type_compte = 0; // Type de compte par défaut pour une nouvelle inscription
  const statut_compte = 1; // Statut de compte actif par défaut pour une nouvelle inscription

  // Vérification de la complexité du mot de passe
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  if (!regex.test(mot_de_passe)) {
    req.flash('error', 'Le mot de passe doit comporter au moins 12 caractères, dont des majuscules, des minuscules, des chiffres et des caractères spéciaux parmi @$!%*?&');
    res.redirect('/inscription');
    return;
  }

  userModel.create(email, mot_de_passe, prenom, nom, { telephone, date_naissance }, statut_compte, type_compte, null, function (result) {
    if (result) {
      res.redirect('/utilisateurs');
    } else {
      req.flash('error', 'L\'inscription a échoué !');
      res.redirect('/inscription');
    }
  });
});

// Route pour l'accueil candidat
router.get('/accueil_candidat', isAuthenticated, checkAccountType(0), function (req, res, next) {
  res.render('accueil_candidat', { title: 'Accueil Candidat' });
});

// Route pour l'accueil recruteur
router.get('/accueil_recruteur', isAuthenticated, checkAccountType(2), function (req, res, next) {
  res.render('accueil_recruteur', { title: 'Accueil Recruteur' });
});

// Route pour l'accueil administrateur
router.get('/accueil_administrateur', isAuthenticated, checkAccountType(1), function (req, res, next) {
  res.render('accueil_administrateur', { title: 'Accueil Administrateur' });
});

// Middleware pour vérifier si l'utilisateur est authentifié
function isAuthenticated(req, res, next) {
  // Votre logique d'authentification, par exemple vérifier la session
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié
}

// Middleware pour vérifier le type de compte de l'utilisateur
function checkAccountType(type) {
  return function (req, res, next) {
    // Votre logique pour vérifier le type de compte de l'utilisateur
    if (req.user.type_compte === type) {
      return next();
    }
    res.redirect('/'); // Redirection vers la page d'accueil si le type de compte ne correspond pas
  };
}

module.exports = router;
