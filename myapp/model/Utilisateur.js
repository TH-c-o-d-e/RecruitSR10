const db = require('./connexion_bd.js');
const offreModel = require('./Offre.js');


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

  create: function (email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, callback) {
    // Récupérer l'ID maximum actuellement présent dans la base de données
    var sql = "SELECT MAX(id) AS max_id FROM Utilisateur";
    db.query(sql, function (err, results) {
      if (err) throw err;
      // Incrémenter l'ID maximum de 1 pour créer le nouvel utilisateur
      var id = results[0].max_id + 1;
      // Insérer le nouvel utilisateur dans la base de données
      sql = "INSERT INTO Utilisateur (id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(sql, [id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation], function (err, result) {
        if (err) throw err;
        callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
      });
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
    // Supprimer les candidatures associées à l'utilisateur
    candidatureModel.deleteByUtilisateur(id, function(err, result) {
      if (err) {
        throw err;
      }
      // Supprimer l'utilisateur
      var sql = "DELETE FROM Utilisateur WHERE id = ?";
      db.query(sql, [id], function (err, result) {
        if (err) throw err;
        callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
      });
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

  readAllSorted: function (sortBy, sortOrder, callback) {
    var sql = "SELECT * FROM Utilisateur ORDER BY " + sortBy + " " + sortOrder;
    db.query(sql, function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  search: function (query, callback) {
    db.query("SELECT * FROM Utilisateur WHERE id LIKE ? OR email LIKE ? OR prenom LIKE ? OR nom LIKE ? OR coordonnees LIKE ? OR statut_compte LIKE ? OR type_compte LIKE ? OR organisation LIKE ?", ['%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%'], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
  readOrganisation: function(id, callback) {
    db.query("SELECT organisation FROM Utilisateur WHERE id = ?", [id], function(err, results) {
      if (err) throw err;
      callback(results);
    });
  },
}