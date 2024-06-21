

const utilisateurModel = require('../model/Utilisateur'); // Assurez-vous que le chemin vers votre modèle utilisateur est correct

// Utilisateur de test pour les tests
const testUser = {
  id: 'eefbab5f-f8b2-4785-a742-241bc7fd1b49',
  email: 'test@email.com',
  mot_de_passe: 'mot-de-passe',
  nom: 'Test',
  prenom: 'Candidat',
  coordonnees: '0601010101',
  statut_compte: 1,
  type: 1,
  organisation: null
};

describe('Tests pour le modèle Utilisateur', () => {
  
  // Test de la fonction read
  it('read devrait retourner un utilisateur existant par son ID', async () => {
    const id = testUser.id;
    const callback = jest.fn();

    await utilisateurModel.read(id, callback);

    expect(callback).toHaveBeenCalledWith(null, expect.objectContaining({
      id: testUser.id,
      email: testUser.email,
      mot_de_passe: testUser.mot_de_passe,
      nom: testUser.nom,
      prenom: testUser.prenom,
      coordonnees: testUser.coordonnees,
      statut_compte: testUser.statut_compte,
      type: testUser.type,
      organisation: testUser.organisation
    }));
  });

  // Test de la fonction readByEmail
  it('readByEmail devrait retourner un utilisateur existant par son email', async () => {
    const email = testUser.email;
    const callback = jest.fn();

    await utilisateurModel.readByEmail(email, callback);

    expect(callback).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        email: testUser.email
      })
    ]));
  });

  // Test de la fonction readAll
  it('readAll devrait retourner tous les utilisateurs', async () => {
    const callback = jest.fn();

    await utilisateurModel.readAll(callback);

    expect(callback).toHaveBeenCalledWith(null, expect.arrayContaining([
      expect.objectContaining({
        id: testUser.id,
        email: testUser.email,
      })
    ]));
  });

  // Test de la fonction areValid
  it('areValid devrait vérifier la validité du couple email/mot_de_passe', async () => {
    const email = testUser.email;
    const mot_de_passe = testUser.mot_de_passe;
    const callback = jest.fn();

    await utilisateurModel.areValid(email, mot_de_passe, callback);

    expect(callback).toHaveBeenCalledWith(null, true, expect.objectContaining({
      email: testUser.email,
      mot_de_passe: testUser.mot_de_passe
    }));
  });

  // Tests pour d'autres fonctions comme create, update, delete, etc. suivent le même schéma
// utilisateur.test.js


    // ...
  
    // Test de la fonction create
    it('create devrait créer un nouvel utilisateur', async () => {
      const email = 'nouveau@test.com';
      const mot_de_passe = 'nouveau_mot_de_passe';
      const prenom = 'Nouveau';
      const nom = 'Utilisateur';
      const coordonnees = '0602020202';
      const statut_compte = 1;
      const type_compte = 2;
      const organisation = null;
      const callback = jest.fn();
  
      await utilisateurModel.create(email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, callback);
  
      expect(callback).toHaveBeenCalledWith(true); // Vérifie que l'appel retourne true pour indiquer la création réussie
    });
  
    // Test de la fonction update
    it('update devrait mettre à jour un utilisateur existant', async () => {
      const id = testUser.id;
      const email = 'test_modifie@email.com';
      const mot_de_passe = 'nouveau_mot_de_passe';
      const prenom = 'NouveauPrenom';
      const nom = 'NouveauNom';
      const coordonnees = '0703030303';
      const statut_compte = 1;
      const type_compte = 0;
      const organisation = null; // Une organisation existante pour l'utilisateur de test
      const callback = jest.fn();
  
      await utilisateurModel.update(id, email, mot_de_passe, prenom, nom, coordonnees, statut_compte, type_compte, organisation, callback);
  
      expect(callback).toHaveBeenCalledWith(true); // Vérifie que l'appel retourne true pour indiquer la mise à jour réussie
    });
  
    // Test de la fonction delete
    it('delete devrait supprimer un utilisateur existant', async () => {
      const id = '8f7a7e0b-7b27-4148-97cc-eb80062805c1';
      const callback = jest.fn();
  
      await utilisateurModel.delete(id, callback);
  
      expect(callback).toHaveBeenCalledWith(true); // Vérifie que l'appel retourne true pour indiquer la suppression réussie
    });
  
    // Test de la fonction readByTypeCompte
    it('readByTypeCompte devrait retourner les utilisateurs du type spécifié', async () => {
      const type_compte = 0;
      const callback = jest.fn();
  
      await utilisateurModel.readByTypeCompte(type_compte, callback);
  
      expect(callback).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          type: type_compte
        })
      ]));
    });
  
    // Test de la fonction readByStatutCompte
    it('readByStatutCompte devrait retourner les utilisateurs du statut spécifié', async () => {
      const statut_compte = 1;
      const callback = jest.fn();
  
      await utilisateurModel.readByStatutCompte(statut_compte, callback);
  
      expect(callback).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          statut_compte: statut_compte
        })
      ]));
    });
  
 
  
    // Test de la fonction readOrganisation
    it('readOrganisation devrait retourner l\'organisation d\'un utilisateur par son ID', async () => {
      const id = testUser.id;
      const callback = jest.fn();
  
      await utilisateurModel.readOrganisation(id, callback);
  
      expect(callback).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          organisation: testUser.organisation
        })
      ]));
    });
  
    // Test de la fonction updateTypeCompte
    it('updateTypeCompte devrait mettre à jour le type de compte d\'un utilisateur', async () => {
      const userId = testUser.id;
      const typeCompte = 1 // Nouveau type de compte
      const callback = jest.fn();
  
      await utilisateurModel.updateTypeCompte(userId, typeCompte, callback);
  
      expect(callback).toHaveBeenCalledWith(true); // Vérifie que l'appel retourne true pour indiquer la mise à jour réussie
    });
});