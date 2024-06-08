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

  create: function (numero_offre, rattachement, etat, date_publication, date_validite, indications, liste_pieces, nombre_pieces, callback) {
    var sql = "INSERT INTO Offre (numero_offre, rattachement, etat, date_publication, date_validite, indications, liste_pieces, nombre_pieces) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [numero_offre, rattachement, etat, date_publication, date_validite, indications, liste_pieces, nombre_pieces], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
    });
  },

  update: function (numero_offre, rattachement, etat, date_publication, date_validite, indications, liste_pieces, nombre_pieces, callback) {
    var sql = "UPDATE Offre SET rattachement = ?, etat = ?, date_publication = ?, date_validite = ?, indications = ?, liste_pieces = ?, nombre_pieces = ? WHERE numero_offre = ?";
    db.query(sql, [rattachement, etat, date_publication, date_validite, indications, liste_pieces, nombre_pieces, numero_offre], function (err, result) {
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

  readByDatePublication: function (date_publication, callback) {
    db.query("SELECT * FROM Offre WHERE date_publication = ?", [date_publication], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readByDateValidite: function (date_validite, callback) {
    db.query("SELECT * FROM Offre WHERE date_validite = ?", [date_validite], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readAllSorted: function (sortBy, sortOrder, callback) {
    var sql = "SELECT * FROM Offre ORDER BY " + sortBy + " " + sortOrder;
    db.query(sql, function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readByIntitule: function (intitule, callback) {
    db.query("SELECT * FROM Offre WHERE rattachement IN (SELECT intitule FROM Fiche WHERE intitule = ?)", [intitule], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
  readByOrganisation: function (organisation, callback) {
    db.query("SELECT * FROM Offre WHERE rattachement IN (SELECT intitule FROM Fiche WHERE organisation = ?)", [organisation], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
  readByStatutPoste: function (statut_poste, callback) {
    db.query("SELECT * FROM Offre WHERE rattachement IN (SELECT intitule FROM Fiche WHERE statut_poste = ?)", [statut_poste], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
  readByLieuMission: function (lieu_mission, callback) {
    db.query("SELECT * FROM Offre WHERE rattachement IN (SELECT intitule FROM Fiche WHERE lieu_mission = ?)", [lieu_mission], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
  readByFourchette: function (fourchette, callback) {
    db.query("SELECT * FROM Offre WHERE rattachement IN (SELECT intitule FROM Fiche WHERE fourchette = ?)", [fourchette], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
  readByRythme: function (rythme, callback) {
    db.query("SELECT * FROM Offre WHERE rattachement IN (SELECT intitule FROM Fiche WHERE rythme = ?)", [rythme], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
  search: function (query, callback) {
    db.query("SELECT * FROM Offre WHERE numero_offre LIKE ? OR rattachement LIKE ? OR indications LIKE ? OR rattachement IN (SELECT intitule FROM Fiche WHERE intitule LIKE ? OR organisation LIKE ? OR statut_poste LIKE ? OR lieu_mission LIKE ? OR fourchette LIKE ? OR rythme LIKE ?)", ['%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%'], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
  
};
