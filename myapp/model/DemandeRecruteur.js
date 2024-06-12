  const db = require('./connexion_bd.js');

  module.exports = {
    read: function (demandeur, organisation, callback) {
      db.query("SELECT * FROM DemandeRecruteur WHERE demandeur = ? AND organisation = ?", [demandeur, organisation], function (err, results) {
        if (err) throw err;
        callback(results);
      });
    },

    readAll: function (callback) {
      db.query("SELECT * FROM DemandeRecruteur", function (err, results) {
        if (err) throw err;
        callback(results);
      });
    },

    create: function (demandeur, organisation, callback) {
      var sql = "INSERT INTO DemandeRecruteur (demandeur, organisation) VALUES (?, ?)";
      db.query(sql, [demandeur, organisation], function (err, result) {
        if (err) throw err;
        callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
      });
    },

    update: function (demandeur, organisation, callback) {
      var sql = "UPDATE DemandeRecruteur SET demandeur = ?, organisation = ? WHERE demandeur = ? AND organisation = ?";
      db.query(sql, [demandeur, organisation, demandeur, organisation], function (err, result) {
        if (err) throw err;
        callback(result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
      });
    },

    delete: function (demandeur, organisation, callback) {
      var sql = "DELETE FROM DemandeRecruteur WHERE demandeur = ? AND organisation = ?";
      db.query(sql, [demandeur, organisation], function (err, result) {
        if (err) throw err;
        callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
      });
    },

    readByDemandeur: function (demandeur, callback) {
      db.query("SELECT * FROM DemandeRecruteur WHERE demandeur = ?", [demandeur], function (err, results) {
        if (err) throw err;
        callback(results);
      });
    },

    readByOrganisation: function (organisation, callback) {
      db.query("SELECT * FROM DemandeRecruteur WHERE organisation = ?", [organisation], function (err, results) {
        if (err) throw err;
        callback(results);
      });
    },

    readAllSorted: function (sortBy, sortOrder, callback) {
      var sql = "SELECT * FROM DemandeRecruteur ORDER BY " + sortBy + " " + sortOrder;
      db.query(sql, function (err, results) {
        if (err) throw err;
        callback(results);
      });
    },

    search: function (query, callback) {
      db.query("SELECT * FROM DemandeRecruteur WHERE demandeur LIKE ? OR organisation LIKE ?", ['%' + query + '%', '%' + query + '%'], function (err, results) {
        if (err) throw err;
        callback(results);
      });
    },
  };
