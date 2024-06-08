
CREATE TABLE `Utilisateur` (
  `id` int(10) NOT NULL,
  `nom` varchar(20) NOT NULL,
  `prenom` varchar(20) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `date_creation` date NOT NULL,
  `actif` tinyint(1) NOT NULL,
  `email` varchar(60) NOT NULL,
  `mot_de_passe` varchar(300) NOT NULL,
  `type` enum('Candidat','Recruteur','Administrateur','') NOT NULL,
  `organisation` int(11) DEFAULT NULL
)


CREATE TABLE `Candidature` (
  `date_candidature` date NOT NULL,
  `candidat` int(11) NOT NULL,
  `offre` int(11) NOT NULL
)

CREATE TABLE `Fiche_poste` (
  `id` int(11) NOT NULL,
  `intitule` varchar(100) NOT NULL,
  `statut` varchar(30) NOT NULL,
  `responsable` varchar(40) NOT NULL,
  `rythme` text NOT NULL,
  `fourchette_basse` float NOT NULL,
  `fourchette_haute` float NOT NULL,
  `description` text NOT NULL,
  `site` int(11) NOT NULL
) ;

CREATE TABLE `Offre_emploi` (
  `numero` int(11) NOT NULL,
  `etat` enum('non publiée','publiée','expirée') NOT NULL,
  `validite` date NOT NULL,
  `indication_pieces` text NOT NULL,
  `nombre_pieces` int(11) NOT NULL,
  `organisation` int(11) NOT NULL,
  `fiche` int(11) NOT NULL,
  `date_publication` date NOT NULL
) 

CREATE TABLE `Organisation` (
  `SIREN` int(60) NOT NULL,
  `Nom` varchar(20) NOT NULL,
  `Validee` enum('En attente','Validée','Refusée','') NOT NULL,
  `Type` varchar(11) NOT NULL,
  `adresse` int(11) NOT NULL
)

CREATE TABLE DemandeRecruteur (
  Demandeur INT NOT NULL,
  Organisation INT NOT NULL,
  PRIMARY KEY (Demandeur, Organisation),
  FOREIGN KEY (Demandeur) REFERENCES Utilisateur(id),
  FOREIGN KEY (Organisation) REFERENCES Organisation(Siren)
);

CREATE TABLE DemandeOrganisation (
  Demandeur INT NOT NULL,
  date DATE,
  Siren INT(9),
  Nom CHAR(255),
  Type CHAR(255),
  Siege_social CHAR(255),
  PRIMARY KEY (Demandeur),
  FOREIGN KEY (Demandeur) REFERENCES Utilisateur(id)
);
