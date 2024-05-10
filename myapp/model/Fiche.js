var db = require('./connexion_db.js');

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
}