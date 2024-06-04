const db = require('./connexion_db.js');

module.exports = {
  read: function (id, callback) {
    db.query("SELECT * FROM Utilisateur WHERE id = ?", id, function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readbyEmail: function (email, callback) { 
    db.query("select * from Utilisateur where email= ?",email, function (err, results) { 
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

  areValid: function (email, password, callback) { 
    sql = "SELECT pwd FROM USERS WHERE email = ?"; 
    rows = db.query(sql, email, function (err, results) { 
        if (err) throw err; 
        if (rows.length == 1 && rows[0].pwd === password) { 
            callback(true) 
        } else { 
            callback(false); 
        } 
    });
  },

  create: function (id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, callback) {
    var sql = "INSERT INTO Utilisateur (id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
    });
  },

  update: function (id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, callback) {
    var sql = "UPDATE Utilisateur SET email = ?, mot_de_passe = ?, prenom = ?, nom = ?, coordonnees = ?, statut_compte = ?, type_compte = ?, organisation = ? WHERE id = ?";
    db.query(sql, [email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, id], function (err, result) {
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

  readByTypeCompte: function (type_compte, callback) {
    db.query("SELECT * FROM Utilisateur WHERE type_compte = ?", [type_compte], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readByStatutCompte: function (statut_compte, callback) {
    db.query("SELECT * FROM Utilisateur WHERE statut_compte = ?", [statut_compte], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
}