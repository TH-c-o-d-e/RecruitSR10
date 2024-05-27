const db = require("./connexion_bd.js");
module.exports = {
    read: function (SIREN, callback) {
        db.query("select * from Organisation where Siren =  ?",SIREN, function
         (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readall: function (callback) {
        db.query("select * from  Organisation", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
   

    creat: function (SIREN, nom, type, siege_social ) {
        var sql = "INSERT INTO Organisation (SIREN, nom, type, siege_social) VALUES (?, ?, ?, ? )";
        db.query(sql, [SIREN, nom, type, siege_social], function (err, result) {
            if (err) throw err;
            callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
        });
    },

     delete: function(SIREN, callback) {
        var sql = "DELETE FROM Organisation WHERE SIREN = ?";
        db.query(sql, [SIREN], function (err, result) {
            if (err) throw err;
            callback(result.affectedRows > 0); // Renvoie true si la suppression a réussi
        });
    },

     update: function(SIREN, nom, type, siege_social, callback) {
        var sql = "UPDATE Organisation SET nom = ?, type = ?, siege_social = ? WHERE SIREN = ?";
        db.query(sql, [nom, type, siege_social, SIREN], function (err, result) {
            if (err) throw err;
            callback(result.affectedRows > 0); // Renvoie true si la mise à jour a réussi
        });
    },
    

    alreadyExists: function (SIREN, callback) {
        const sql = "SELECT COUNT(*) AS count FROM Organisation WHERE SIREN = ?";
        db.query(sql, SIREN, function (err, results) {
            if (err) {
                throw err;
            }
            const organisationCount = results[0].count;
            callback(organisationCount > 0);
        });
    }
}
