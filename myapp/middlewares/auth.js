// middlewares/auth.js
module.exports = function(req, res, next) {
    if (!req.session.user) {
      // Si l'utilisateur n'est pas connecté, redirigez vers la page de connexion
      return res.redirect('/connexion');
    }
    next();
  };
  