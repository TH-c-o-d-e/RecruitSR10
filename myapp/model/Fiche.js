const db = require('./connexion_db.js');

module.exports = {
    read: function (intitule, organisation, callback) {
        db.query("select(*,*) from Fiche where (intitule, organisation) = (?, ?)",offre, function
         (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readall: function (callback) {
        db.query("select * from Fiche", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
   

    creat: function (intitule, organisation, statut_poste , responsable, lieu_mission, rythme, fourchette) {
        var sql = "INSERT INTO Fiche (intitule, organisation, statut_poste , responsable, lieu_mission, rythme, fourchette) VALUES (?, ?, ?, ?, ?, ?, ? )";
        db.query(sql, [intitule, organisation, statut_poste , responsable, lieu_mission, rythme, fourchette], function (err, result) {
            if (err) throw err;
            callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
        });
    },


readByIntituleAndOrganisation: function (intitule, organisation, callback) {
    db.query("SELECT * FROM Fiche WHERE intitule = ? AND organisation = ?", [intitule, organisation], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },

  update: function (id, intitule, organisation, statut_poste, responsable, lieu_mission, rythme, fourchette, callback) {
    var sql = "UPDATE Fiche SET intitule = ?, organisation = ?, statut_poste = ?, responsable = ?, lieu_mission = ?, rythme = ?, fourchette = ? WHERE id = ?";
    db.query(sql, [intitule, organisation, statut_poste, responsable, lieu_mission, rythme, fourchette, id], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
    });


},
deleteById: function (id, callback) {
    var sql = "DELETE FROM Fiche WHERE id = ?";
    db.query(sql, [id], function (err, result) {
      if (err) throw err;
      callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
    });
  },
  
  readByIntitule: function (intitule, callback) {
    db.query("SELECT * FROM Fiche WHERE intitule = ?", [intitule], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
  readByOrganisation: function (organisation, callback) {
    db.query("SELECT * FROM Fiche WHERE organisation = ?", [organisation], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  
  readByStatutPoste: function (statut_poste, callback) {
    db.query("SELECT * FROM Fiche WHERE statut_poste = ?", [statut_poste], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
    

}


