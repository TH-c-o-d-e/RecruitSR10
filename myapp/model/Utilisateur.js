var db = require('./connexion_db.js');

module.exports = {
    read: function (email, callback) {
        db.query("select * from Utilisateur where email= ?",email, function
         (err, results) {
            if (err) throw err;
            callback(results);
        });
    },

    readall: function (callback) {
        db.query("select * from Utilisateur", function (err, results) {
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
            } 
            else {
                callback(false);
            }
        });
    },

    creat: function (email, nom, prenom, pwd, type, coordonnees, statut_compte, type_compte, organisation) {
        var sql = "INSERT INTO Utilisateur (email, nom, prenom, pwd, type, coordonnees) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [email, nom, prenom, pwd, type, coordonnees, statut_compte, type_compte, organisation], function (err, result) {
            if (err) throw err;
            callback(result.affectedRows > 0); // Renvoie true si l'insertion a réussi
        });
    },

    updateUser: function (email, newValues, callback) {
        const sql = "UPDATE Utilisateur SET nom = ?, prenom = ?, pwd = ?, type = ?, coordonnees = ?, statut_compte = ?, type_compte = ?, organisation = ? WHERE email = ?";
        const { nom, prenom, pwd, type, coordonnees, statut_compte, type_compte, organisation } = newValues;
        db.query(sql, [nom, prenom, pwd, type, coordonnees, statut_compte, type_compte, organisation, email], function (err, result) {
            if (err) {
                callback(err, false);
            } else {
                callback(null, result.affectedRows > 0);
            }
        });
    },

    deleteUser: function (email, callback) {
        const sql = "DELETE FROM Utilisateur WHERE email = ?";
        db.query(sql, [email], function (err, result) {
            if (err) {
                callback(err, false);
            } else {
                callback(null, result.affectedRows > 0);
            }
        });
    }
    
        
    
}

