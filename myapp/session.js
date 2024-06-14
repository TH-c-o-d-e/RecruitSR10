// session.js

module.exports = {
  // Initialisation de la session
  init: () => {
    const session = require("express-session");
    return session({
      secret: "xxxzzzyyyaaabbbcc",
      saveUninitialized: true,
      cookie: { maxAge: 3600 * 1000 }, // 60 minutes
      resave: false,
    });
  },

  // Création d'une session avec un rôle spécifique
  createSession: function (session, userid, role) {
    session.userid = userid;
    session.role = role;
    session.save(function (err) {
      if (err)
        console.error("Erreur lors de la sauvegarde de la session :", err);
    });
    return session;
  },

  // Vérification de l'authentification et du rôle
  isConnected: function (session) {
    return session.userid !== undefined;
  },

  // Vérification du rôle
  hasRole: function (session, role) {
    return session.role === role;
  },

  // Destruction de la session
  deleteSession: function (session) {
    session.destroy();
  },
};
