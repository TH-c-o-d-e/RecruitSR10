const db = require('./connexion_bd.js');

module.exports = {
  read: function(demandeur, callback) {
    db.query("SELECT * FROM DemandeOrganisation WHERE demandeur = ?", [demandeur], function(err, results) {
      if (err) {
        console.error('Error reading demandeur:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  readAll: function(callback) {
    db.query("SELECT * FROM DemandeOrganisation", function(err, results) {
      if (err) {
        console.error('Error reading all DemandeOrganisation:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  create: function(demandeur, date, siren, nom, type, siege_social, callback) {
    var sql = "INSERT INTO DemandeOrganisation (demandeur, date, siren, nom, type, siege_social) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [demandeur, date, siren, nom, type, siege_social], function(err, result) {
      if (err) {
        console.error('Error creating DemandeOrganisation:', err);
        return callback(err, null);
      }
      callback(null, result.affectedRows > 0); // Renvoie true si l'insertion a réussi
    });
  },

  update: function(demandeur, date, siren, nom, type, siege_social, callback) {
    var sql = "UPDATE DemandeOrganisation SET date = ?, siren = ?, nom = ?, type = ?, siege_social = ? WHERE demandeur = ?";
    db.query(sql, [date, siren, nom, type, siege_social, demandeur], function(err, result) {
      if (err) {
        console.error('Error updating DemandeOrganisation:', err);
        return callback(err, null);
      }
      callback(null, result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
    });
  },

  delete: function(demandeur, callback) {
    var sql = "DELETE FROM DemandeOrganisation WHERE demandeur = ?";
    db.query(sql, [demandeur], function(err, result) {
      if (err) {
        console.error('Error deleting DemandeOrganisation:', err);
        return callback(err, null);
      }
      callback(null, result.affectedRows > 0); // Renvoie true si la suppression a réussi
    });
  },

  readByDemandeur: function(demandeur, callback) {
    db.query("SELECT * FROM DemandeOrganisation WHERE demandeur = ?", [demandeur], function(err, results) {
      if (err) {
        console.error('Error reading by demandeur:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  readByDate: function(date, callback) {
    db.query("SELECT * FROM DemandeOrganisation WHERE date = ?", [date], function(err, results) {
      if (err) {
        console.error('Error reading by date:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  readAllSorted: function(sortBy, sortOrder, callback) {
    var sql = "SELECT * FROM DemandeOrganisation ORDER BY " + sortBy + " " + sortOrder;
    db.query(sql, function(err, results) {
      if (err) {
        console.error('Error reading all sorted DemandeOrganisation:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  search: function(query, callback) {
    db.query("SELECT * FROM DemandeOrganisation WHERE demandeur LIKE ? OR siren LIKE ? OR nom LIKE ? OR type LIKE ? OR siege_social LIKE ?", ['%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%'], function(err, results) {
      if (err) {
        console.error('Error searching DemandeOrganisation:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },
};
