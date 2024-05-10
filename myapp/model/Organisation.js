var db = require('./connexion_db.js');

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
}