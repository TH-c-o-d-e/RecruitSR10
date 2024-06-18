const session = require('express-session');

module.exports = {
  // Initialisation de la session
  init: () => {
    return session({
      secret: "xxxzzzyyyaaabbbcc",
      saveUninitialized: true,
      cookie: { maxAge: 3600 * 1000 }, // 60 minutes
      resave: false,
    });
  },

  // Création d'une session avec un rôle spécifique
  createSession: function (reqSession, userid, role) {
    reqSession.userid = userid;
    reqSession.type = role;
    reqSession.save(function (err) {
      if (err) console.error("Erreur lors de la sauvegarde de la session :", err);
    });
    return reqSession;
  },

  // Vérification de l'authentification et du rôle
  isConnected: function (reqSession) {
    return reqSession.userid !== undefined;
  },

  // Vérification du rôle
  hasRole: function (reqSession, role) {
    return reqSession.type === role;
  },

  // Destruction de la session
  deleteSession: function (reqSession) {
    reqSession.destroy();
  },
};
