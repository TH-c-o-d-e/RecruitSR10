const db = require('./connexion_db.js');

module.exports = {
    read: function (numero_offre, callback) {
        db.query("select * from Offre where numero_offre = (?, ?)",numero_offre, function
         (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readall: function (callback) {
        db.query("select * from  Offre", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
   

    creat: function (numero_offre,rattachement, etat, date_validite, indications, liste_pieces, nombre_pieces) {
        var sql = "INSERT INTO Offre (numero_offre,rattachement, etat, date_validite, indications, liste_pieces, nombre_pieces) VALUES (?, ?, ?, ?, ?, ?, ? )";
        db.query(sql, [numero_offre,rattachement, etat, date_validite, indications, liste_pieces, nombre_pieces], function (err, result) {
            if (err) throw err;
            callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
        });
    },

    readByNumeroOffre: function (numero_offre, callback) {
        db.query("SELECT * FROM Offre WHERE numero_offre = ?", [numero_offre], function (err, results) {
          if (err) throw err;
          callback(results);
        });
      },
      
      update: function (id, numero_offre, rattachement, etat, date_validite, indications, liste_pieces, nombre_pieces, callback) {
        var sql = "UPDATE Offre SET numero_offre = ?, rattachement = ?, etat = ?, date_validite = ?, indications = ?, liste_pieces = ?, nombre_pieces = ? WHERE id = ?";
        db.query(sql, [numero_offre, rattachement, etat, date_validite, indications, liste_pieces, nombre_pieces, id], function (err, result) {
          if (err) throw err;
          callback(result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
        });
      },

      deleteById: function (id, callback) {
        var sql = "DELETE FROM Offre WHERE id = ?";
        db.query(sql, [id], function (err, result) {
          if (err) throw err;
          callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
        });
      },
             
      
}