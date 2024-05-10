var db = require('./connexion_db.js');

module.exports = {
    read: function (offre, candidat, callback) {
        db.query("select (* , *) from Candidature where (offre, candidat) =(?, ?)",offre, candidat, function
         (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readall: function (callback) {
        db.query("select * from Candidature", function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
   

    creat: function (offre, candidat, date , pieces, callback) {
        var sql = "INSERT INTO Candidature (offre, candidat, date, pieces) VALUES (?, ?, ?, ?)";
        db.query(sql, [offre, candidat, date, pieces], function (err, result) {
            if (err) throw err;
            callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
        });
    },
}