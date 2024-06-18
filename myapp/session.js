var sessions = require('express-session');

module.exports = {
  init: () => {
    return sessions({
      secret: 'xxxzzzyyyaaabbbcc',
      saveUninitialized: true,
      cookie: { maxAge: 3600 * 1000 }, // 60 minutes
      resave: false,
    });
  },

  createSession: function (session, userid, type) {
    if (!session) {
      throw new Error('Session is not defined.');
    }
    session.userid = userid;
    session.type = type;
    session.save(function (err) {
      if (err) {
        console.error('Erreur lors de la sauvegarde de la session :', err);
      }
    });
    return session;
  },

  isConnected: (session) => {
    return session && session.userid !== undefined;
  },

  deleteSession: function (session) {
    session.destroy();
  },
};
