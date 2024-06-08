const db = require('./connexion_db.js');
const offreModel = require('./Offre.js');

module.exports = {
  read: function (intitule, organisation, callback) {
    db.query("SELECT * FROM Fiche WHERE intitule = ? AND organisation = ?", [intitule, organisation], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readAll: function (callback) {
    db.query("SELECT * FROM Fiche", function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  create: function (intitule, organisation, statut_poste, responsable, lieu_mission, rythme, fourchette, callback) {
    var sql = "INSERT INTO Fiche (intitule, organisation, statut_poste, responsable, lieu_mission, rythme, fourchette) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [intitule, organisation, statut_poste, responsable, lieu_mission, rythme, fourchette], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
    });
  },

  update: function (intitule, organisation, statut_poste, responsable, lieu_mission, rythme, fourchette, callback) {
    var sql = "UPDATE Fiche SET statut_poste = ?, responsable = ?, lieu_mission = ?, rythme = ?, fourchette = ? WHERE intitule = ? AND organisation = ?";
    db.query(sql, [statut_poste, responsable, lieu_mission, rythme, fourchette, intitule, organisation], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
    });
  },

  delete: function (intitule, organisation, callback) {
    // Supprimer les offres associées à la fiche
    offreModel.deleteByFiche(intitule, organisation, function(err, result) {
      if (err) {
        throw err;
      }
      // Supprimer la fiche
      var sql = "DELETE FROM Fiche WHERE intitule = ? AND organisation = ?";
      db.query(sql, [intitule, organisation], function (err, result) {
        if (err) throw err;
        callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
      });
    });
  },

  readByIntitule: function (intitule, callback) {
    db.query("SELECT * FROM Fiche WHERE intitule = ?", [intitule], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readByOrganisation: function (organisation, callback) {
    db.query("SELECT * FROM Fiche WHERE organisation = ?", [organisation], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readByStatutPoste: function (statut_poste, callback) {
    db.query("SELECT * FROM Fiche WHERE statut_poste = ?", [statut_poste], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  readAllSorted: function (sortBy, sortOrder, callback) {
    var sql = "SELECT * FROM Fiche ORDER BY " + sortBy + " " + sortOrder;
    db.query(sql, function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
};

