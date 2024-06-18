const db = require('./connexion_bd.js');
const offreModel = require('./Offre.js');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  read: function (id, callback) {
    db.query('SELECT * FROM Utilisateur WHERE id = ?', [id], function(err, results) {
      if (err) return callback(err, null);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0]);
    });
  },

  readByEmail: function (email, callback) { 
    db.query("SELECT * FROM Utilisateur WHERE email = ?", [email], function (err, results) { 
        if (err) throw err; 
        callback(results); 
    }); 
  },

  readAll: function(callback) {
    const sql = "SELECT * FROM Utilisateur";
    db.query(sql, function(err, results) {
      if (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        return callback(err, null);
      }

      // Mapper les résultats pour transformer les RowDataPacket en objets JavaScript simples
      const users = results.map(row => ({
        id: row.id,
        email: row.email,
        mot_de_passe: row.mot_de_passe,
        nom: row.nom,
        prenom: row.prenom,
        coordonnees: row.coordonnees,
        statut_compte: row.statut_compte,
        type: row.type,
        organisation: row.organisation
      }));

      // Appeler le callback avec les utilisateurs transformés
      callback(null, users);
    });
  },

  areValid: function(email, mot_de_passe, callback) {
    db.query('SELECT * FROM Utilisateur WHERE email = ? AND mot_de_passe = ?', [email, mot_de_passe], function(error, results, fields) {
      if (error) {
        console.error('Erreur lors de la requête à la base de données:', error);
        return callback(false, null);
      }
  
      if (results.length > 0) {
        var user = results[0];
        return callback(true, user);
      } else {
        return callback(false, null);
      } 
    });
  },
  create: function (email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, callback) {
    var id = uuidv4();
    var sql = "INSERT INTO Utilisateur (id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type, organisation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation], function (err, result) {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          callback(false, 'Email already exists');
        } else {
          throw err;
        }
      } else {
        callback(true);
      }
    });
  },
  update: function (id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, callback) {
    const sql = "UPDATE Utilisateur SET email = ?, mot_de_passe = ?, prenom = ?, nom = ?, coordonnees = ?, statut_compte = ?, type = ?, organisation = ? WHERE id = ?";
    db.query(sql, [email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, id], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
    });
  },

  delete: function (id, callback) {
    const candidatureModel = require('./Candidature.js'); // Assurez-vous que ce fichier existe et est correctement configuré
    candidatureModel.deleteByUtilisateur(id, function(err, result) {
      if (err) throw err;
      const sql = "DELETE FROM Utilisateur WHERE id = ?";
      db.query(sql, [id], function (err, result) {
        if (err) throw err;
        callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
      });
    });
  },
  
  readByTypeCompte: function (type_compte, callback) {
    db.query("SELECT * FROM Utilisateur WHERE type = ?", [type_compte], function (err, results) {
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
    const sql = "SELECT * FROM Utilisateur ORDER BY ?? " + (sortOrder === 'DESC' ? 'DESC' : 'ASC');
    db.query(sql, [sortBy], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  search: function (query, callback) {
    const sql = `
      SELECT * FROM Utilisateur 
      WHERE id LIKE ? OR email LIKE ? OR prenom LIKE ? OR nom LIKE ? OR coordonnees LIKE ? OR statut_compte LIKE ? OR type_compte LIKE ? OR organisation LIKE ?
    `;
    const searchQuery = '%' + query + '%';
    db.query(sql, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery], function (err, results) {
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

  updateTypeCompte: function(userId, typeCompte, callback) {
    const sql = "UPDATE Utilisateur SET type = ? WHERE id = ?";
    db.query(sql, [typeCompte, userId], function(err, result) {
      if (err) {
        console.error("Erreur lors de la mise à jour du type de compte de l'utilisateur :", err);
        callback(false);
      } else {
        callback(true);
      }
    });
  }
}
