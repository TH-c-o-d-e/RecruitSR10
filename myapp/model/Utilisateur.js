const db = require('./connexion_db.js');

module.exports = {
  read: function (id, callback) {
    db.query("SELECT * FROM Utilisateur WHERE id = ?", id, function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readByEmail: function (email, callback) {
    db.query("SELECT * FROM Utilisateur WHERE email = ?", email, function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readAll: function (callback) {
    db.query("SELECT * FROM Utilisateur", function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  create: function (email, nom, prenom, mot_de_passe, type_compte, telephone, adresse, code_postal, ville, callback) {
    var sql = "INSERT INTO Utilisateur (email, nom, prenom, mot_de_passe, type_compte, telephone, adresse, code_postal, ville) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [email, nom, prenom, mot_de_passe, type_compte, telephone, adresse, code_postal, ville], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
    });
  },

  update: function (id, email, nom, prenom, mot_de_passe, type_compte, telephone, adresse, code_postal, ville, callback) {
    var sql = "UPDATE Utilisateur SET email = ?, nom = ?, prenom = ?, mot_de_passe = ?, type_compte = ?, telephone = ?, adresse = ?, code_postal = ?, ville = ? WHERE id = ?";
    db.query(sql, [email, nom, prenom, mot_de_passe, type_compte, telephone, adresse, code_postal, ville, id], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
    });
  },

  updateTypeCompte: function (id, newTypeCompte, callback) {
    var sql = "UPDATE Utilisateur SET type_compte = ? WHERE id = ?";
    db.query(sql, [newTypeCompte, id], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
    });
  },

  delete: function (id, callback) {
    var sql = "DELETE FROM Utilisateur WHERE id = ?";
    db.query(sql, [id], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
    });
  },

  alreadyExists: function (email, callback) {
    const sql = "SELECT COUNT(*) AS count FROM Utilisateur WHERE email = ?";
    db.query(sql, email, function (err, results) {
      if (err) {
        throw err;
      }
      const userCount = results[0].count;
      callback(userCount > 0);
    });
  }
};
