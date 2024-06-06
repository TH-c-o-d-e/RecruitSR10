const db = require('./connexion_db.js');

module.exports = {
  read: function (numero_offre, callback) {
    db.query("SELECT * FROM Offre WHERE numero_offre = ?", numero_offre, function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readAll: function (callback) {
    db.query("SELECT * FROM Offre", function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  create: function (numero_offre, rattachement, etat, date_validite, indications, liste_pieces, nombre_pieces, callback) {
    var sql = "INSERT INTO Offre (numero_offre, rattachement, etat, date_validite, indications, liste_pieces, nombre_pieces) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [numero_offre, rattachement, etat, date_validite, indications, liste_pieces, nombre_pieces], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
    });
  },

  update: function (numero_offre, rattachement, etat, date_validite, indications, liste_pieces, nombre_pieces, callback) {
    var sql = "UPDATE Offre SET rattachement = ?, etat = ?, date_validite = ?, indications = ?, liste_pieces = ?, nombre_pieces = ? WHERE numero_offre = ?";
    db.query(sql, [rattachement, etat, date_validite, indications, liste_pieces, nombre_pieces, numero_offre], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
    });
  },

  delete: function (numero_offre, callback) {
    var sql = "DELETE FROM Offre WHERE numero_offre = ?";
    db.query(sql, [numero_offre], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
    });
  },

  deleteByFiche: function (intitule, organisation, callback) {
    var sql = "DELETE FROM Offre WHERE rattachement = (SELECT id FROM Fiche WHERE intitule = ? AND organisation = ?)";
    db.query(sql, [intitule, organisation], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
    });
  },

  readByRattachement: function (rattachement, callback) {
    db.query("SELECT * FROM Offre WHERE rattachement = ?", [rattachement], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readByEtat: function (etat, callback) {
    db.query("SELECT * FROM Offre WHERE etat = ?", [etat], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },    

  readByDateValidite: function (date_validite, callback) {
    db.query("SELECT * FROM Offre WHERE date_validite = ?", [date_validite], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  }
};
