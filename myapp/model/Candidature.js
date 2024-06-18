const db = require('./connexion_bd.js');

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
  deleteByUtilisateur: function(utilisateurId, callback) {
    const sql = `
      DELETE FROM Candidature 
      WHERE candidat = ? 
      AND EXISTS (
        SELECT 1 FROM Utilisateur WHERE id = ? AND Candidature.candidat = Utilisateur.id
      )
    `;
    db.query(sql, [utilisateurId, utilisateurId], function(err, result) {
      if (err) {
        console.error('Erreur lors de la suppression des candidatures de l\'utilisateur:', err);
        return callback(err);
      }
      callback(null, result.affectedRows > 0); // Renvoie true si des candidatures ont été supprimées
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
  
  search: function (query, callback) {
    db.query("SELECT * FROM Candidature WHERE offre LIKE ? OR candidat LIKE ? OR date LIKE ? OR pieces LIKE ?", ['%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%'], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
  downloadAllPieces: function(candidatureId, callback) {
    const sql = "SELECT chemin_piece FROM PiecesCandidature WHERE candidature_id = ?";
    db.query(sql, [candidatureId], function(err, results) {
      if (err) {
        console.error(err);
        return callback(err);
      }

      if (results.length === 0) {
        return callback(null, null); // Aucun fichier trouvé
      }

      const filePaths = results.map(result => result.chemin_piece);
      callback(null, filePaths);
    });
  },

};

