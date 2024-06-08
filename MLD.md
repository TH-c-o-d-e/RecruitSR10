Utilisateur(#id : char NOT NULL, email : char NOT NULL, mot de passe : char, prenom: char, nom: char, coordonnées : int(10), statut du compte : int(1), type de compte : int(1) organisation=>Organisation.siren) avec id, coordonnées, email UNIQUE , NOT ((organisation AND type != 2) OR (NOT(organisation) AND type == 2))

PS: Le type de compte dans la table Utilisateur est 0 pour Admin , 1 pour Candidat et 2 pour recruteur.

Organisation( #Siren : int(9), NOT NULL Nom : char, Type : char : Siège social : char)

Fiche( #Intitulé : char NOT NULL,# Organisation => Organisation.siren NOT NULL, Statut de poste : char, Responsable hiérarchique : char, lieu de mission : char, Rythme : char, fourchette : char)

Offre(#numéro d'offre : int NOT NULL, rattachement => Fiche, 0 : inactif / 1 actif : char, Date de publication : date NOT NULL  Date de validité : date, Indications : char /file, liste de pieces : char, nombre de pieces : int)

Candidature (#offre => Offre, #Candidat => Utilisateur, date : date, pieces : file)

DemandeRecruteur(#Demandeur => Utilisateur : NOT NULL,  #Organisation=NOT NULL )

DemandeOrganisation(#Demandeur => Utilisateur : NOT NULL, date : date #Siren: int(9),  NULL Nom : char, Type : char : Siège social : char ) 