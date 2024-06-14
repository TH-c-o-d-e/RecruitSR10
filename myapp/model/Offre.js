const db = require('./connexion_bd.js');
const ficheModel = require('./Fiche.js');

module.exports = {
  read: function (numOffre, callback) {
    db.query("SELECT * FROM Offre WHERE numero_offre = ?", [numOffre], function (err, results) {
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

  create: function (numOffre, fiche, actif, datePublication, dateValidite, indications, listePieces, nombrePieces, callback) {
    var sql = "INSERT INTO Offre (numero_offre, rattachement, actif, date_publication, date_validite, indications, liste_pieces, nombre_pieces) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [numOffre, fiche, actif, datePublication, dateValidite, indications, listePieces, nombrePieces], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
    });
  },

  update: function (numOffre, fiche, actif, datePublication, dateValidite, indications, listePieces, nombrePieces, callback) {
    var sql = "UPDATE Offre SET rattachement = ?, actif = ?, date_publication = ?, date_validite = ?, indications = ?, liste_pieces = ?, nombre_pieces = ? WHERE numero_offre = ?";
    db.query(sql, [fiche, actif, datePublication, dateValidite, indications, listePieces, nombrePieces, numOffre], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
    });
  },

  delete: function (numOffre, callback) {
    var sql = "DELETE FROM Offre WHERE numero_offre = ?";
    db.query(sql, [numOffre], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
    });
  },

  readByFiche: function (fiche, callback) {
    db.query("SELECT * FROM Offre WHERE rattachement = ?", [fiche], function (err, results) {
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

  search: function (query, callback) {
    db.query("SELECT * FROM Offre WHERE numero_offre LIKE ? OR indications LIKE ?", ['%' + query + '%', '%' + query + '%'], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  readByRattachement: function (value, organisation, callback) {
    db.query("SELECT * FROM Offre JOIN Fiche ON Offre.rattachement = Fiche.Intitulé WHERE Fiche.rattachement = ? AND Fiche.Organisation = ?", [value, organisation], callback);
  },

  readByEtat: function (value, callback) {
    db.query("SELECT * FROM Offre WHERE etat = ?", [value], callback);
  },

  readByDatePublication: function (value, callback) {
    db.query("SELECT * FROM Offre WHERE date_publication = ?", [value], callback);
  },

  readByDateValidite: function (value, callback) {
    db.query("SELECT * FROM Offre WHERE date_validite = ?", [value], callback);
  },

  readByIntitule: function (value, organisation, callback) {
    db.query("SELECT * FROM Offre JOIN Fiche ON Offre.rattachement = Fiche.Intitulé WHERE Fiche.Intitulé LIKE ? AND Fiche.Organisation = ?", ['%' + value + '%', organisation], callback);
  },

  readByOrganisation: function (organisation, callback) {
    db.query("SELECT * FROM Offre JOIN Fiche ON Offre.rattachement = Fiche.Intitulé WHERE Fiche.Organisation = ?", [organisation], callback);
  },

  readByStatutPoste: function (value, organisation, callback) {
    db.query("SELECT * FROM Offre JOIN Fiche ON Offre.rattachement = Fiche.Intitulé WHERE Fiche.Statut_poste LIKE ? AND Fiche.Organisation = ?", ['%' + value + '%', organisation], callback);
  },

  readByLieuMission: function (value, organisation, callback) {
    db.query("SELECT * FROM Offre JOIN Fiche ON Offre.rattachement = Fiche.Intitulé WHERE Fiche.Lieu_mission LIKE ? AND Fiche.Organisation = ?", ['%' + value + '%', organisation], callback);
  },

  readByFourchette: function (value, organisation, callback) {
    db.query("SELECT * FROM Offre JOIN Fiche ON Offre.rattachement = Fiche.Intitulé WHERE Fiche.Fourchette = ? AND Fiche.Organisation = ?", [value, organisation], callback);
  },

  readByRythme: function (value, organisation, callback) {
    db.query("SELECT * FROM Offre JOIN Fiche ON Offre.rattachement = Fiche.Intitulé WHERE Fiche.Rythme LIKE ? AND Fiche.Organisation = ?", ['%' + value + '%', organisation], callback);
  },

  search: function (query, organisation, callback) {
    db.query("SELECT * FROM Offre JOIN Fiche ON Offre.rattachement = Fiche.Intitulé WHERE (Fiche.Intitulé LIKE ? OR Fiche.Organisation LIKE ? OR Fiche.Statut_poste LIKE ? OR Fiche.Lieu_mission LIKE ? OR Fiche.Rythme LIKE ? OR Fiche.Fourchette LIKE ?) AND Fiche.Organisation = ?", 
      ['%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', '%' + query + '%', organisation], callback);
  },

  readAllNonExpirees: function (callback) {
    db.query("SELECT * FROM Offre WHERE date_validite >= CURDATE() OR date_validite IS NULL", callback);
  }
};
