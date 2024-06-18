var express = require('express');
var router = express.Router();
var sessionManager = require('../session');

router.get('/', function(req, res, next) {
  sessionManager.deleteSession(req.session);
  res.redirect('/connexion');
});

module.exports = router;
