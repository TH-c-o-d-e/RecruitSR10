const db = require('./connexion_db.js');

module.exports = {
  read: function (offre, candidat, callback) {
    db.query("SELECT * FROM Candidature WHERE offre = ? AND candidat = ?", [offre, candidat], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readAll: function (callback) {
    db.query("SELECT * FROM Candidature", function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  create: function (offre, candidat, date, pieces, callback) {
    var sql = "INSERT INTO Candidature (offre, candidat, date, pieces) VALUES (?, ?, ?, ?)";
    db.query(sql, [offre, candidat, date, pieces], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
    });
  },

  update: function (offre, candidat, date, pieces, callback) {
    var sql = "UPDATE Candidature SET date = ?, pieces = ? WHERE offre = ? AND candidat = ?";
    db.query(sql, [date, pieces, offre, candidat], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
    });
  },

  delete: function (offre, candidat, callback) {
    var sql = "DELETE FROM Candidature WHERE offre = ? AND candidat = ?";
    db.query(sql, [offre, candidat], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
    });
  },

  readByOffre: function (offre, callback) {
    db.query("SELECT * FROM Candidature WHERE offre = ?", [offre], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readByCandidat: function (candidat, callback) {
    db.query("SELECT * FROM Candidature WHERE candidat = ?", [candidat], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readByDate: function (date, callback) {
    db.query("SELECT * FROM Candidature WHERE date = ?", [date], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  readAllSorted: function (sortBy, sortOrder, callback) {
    var sql = "SELECT * FROM Candidature ORDER BY " + sortBy + " " + sortOrder;
    db.query(sql, function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
};

