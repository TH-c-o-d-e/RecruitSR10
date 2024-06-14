const db = require('./connexion_bd.js');

module.exports = {
  read: function (siren, callback) {
    db.query("SELECT * FROM Organisation WHERE siren = ?", [siren], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readAll: function (callback) {
    db.query("SELECT * FROM Organisation", function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  create: function (siren, nom, type, siege_social, callback) {
    var sql = "INSERT INTO Organisation (siren, nom, type, siege_social) VALUES (?, ?, ?, ?)";
    db.query(sql, [siren, nom, type, siege_social], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
    });
  },

  update: function (siren, nom, type, siege_social, callback) {
    var sql = "UPDATE Organisation SET nom = ?, type = ?, siege_social = ? WHERE siren = ?";
    db.query(sql, [nom, type, siege_social, siren], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
    });
  },

  delete: function (siren, callback) {
    var sql = "DELETE FROM Organisation WHERE siren = ?";
    db.query(sql, [siren], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
    });
  },

  readByType: function (type, callback) {
    db.query("SELECT * FROM Organisation WHERE type = ?", [type], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readBySiegeSocial: function (siege_social, callback) {
    db.query("SELECT * FROM Organisation WHERE siege_social = ?", [siege_social], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readAllSorted: function (sortBy, sortOrder, callback) {
    var sql = "SELECT * FROM Organisation ORDER BY " + sortBy + " " + sortOrder;
    db.query(sql, function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  search: function (query, callback) {
    db.query("SELECT * FROM Organisation WHERE siren LIKE ? OR nom LIKE ? OR type LIKE ? OR siege_social LIKE ?", ['%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%'], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
};
