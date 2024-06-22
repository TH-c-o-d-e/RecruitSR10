Utilisateur(*\#id : char NOT NULL,* email : char NOT NULL, mot de passe : char, prenom: char, nom: char, coordonnées : int(10), statut du compte : int(1), type de compte : int(1) organisation=>Organisation.siren) avec id, coordonnées, email UNIQUE , NOT ((organisation AND type != 2) OR (NOT(organisation) AND type == 2))

PS: Le type de compte dans la table Utilisateur est 0 pour Admin , 1 pour Candidat et 2 pour recruteur.

Organisation( #Siren : int(9), NOT NULL Nom : char, Type : char : Siège social : char)

Fiche( #Intitulé : char NOT NULL,# Organisation => Organisation.siren NOT NULL, Statut de poste : char, Responsable hiérarchique : char, lieu de mission : char, Rythme : char, fourchette : char)

Offre(#numéro d'offre : int NOT NULL, rattachement => Fiche, Etat : char, Date de validité : int(10), Indications : char /file, liste de pieces : char, nombre de pieces : int)

Candidature (#offre => Offre, #Candidat => Utilisateur, date : char(10), pieces : file)

DemandeOrganisation(#Demandeur : varchar(36) NOT NULL PRIMARY KEY,date : date,#Siren : int(9),Nom : char(255),Type : char(255),Siege_social : char(255))

DemandeRecruteur(#Demandeur : varchar(36) NOT NULL ,#Organisation : int(11) NOT NUL)