# Introduction

Une application Web peut faire l'objet de nombreuses vulnérabilité si le programmeur n'est pas attentif. Pour sécuriser une application web, plusieurs mesures peuvent être appliquées face à différents problèmes. Nous allons évoquer 3 problèmes et comment se protéger contre ces problèmes.

# 1er Problème : Injection SQL

L'injection SQL est une vulnérabilité largement connue et répandue. Elle consiste à manipuler l'interpréteur SQL d'un SGBD en utilisant des données non validées pour exécuter des opérations non autorisées sur la base de données ou accéder à des informations confidentielles.

Une méthode pour exploiter cette faille consiste à entrer dans un formulaire des caractères tels que " ou ' ou d'autres symboles que l'interpréteur SQL pourrait considérer comme des caractères spéciaux, modifiant ainsi la requête SQL initiale.

Si l'application utilise les données de la manière suivante :

`db.query("SELECT mot_de_passe FROM Utilisateur WHERE nom = " + donnee + " AND id=" + req.session.id.toString());`

On pourrait alors par exemple, entrer : Jean". Ce guillemet à la fin peut interrompre la chaîne SQL, permettant ainsi de récupérer le mot de passe de Jean sans connaître son identifiant de session. De nombreuses autres attaques sont possibles, comme terminer la requête en cours et ajouter un DROP pour supprimer la table. Il est donc crucial de valider et filtrer les caractères dangereux des entrées utilisateur. Certaines méthodes, comme l'échappement des caractères spéciaux, peuvent faciliter cette tâche.
Un correction possible est d'utiliser les requêtes parametrées comme ceci :
`db.query("SELECT * FROM Utilisateur WHERE email=?", [email], function(err, results) {`
En utilisant un ? à la place des paramètres dans la requête et en les mettant après en liste, les chaînes sont échappées au mieux.

# 2ème Problème : faille XSS

Une faille XSS est une vulnérabilité qui survient lorsque des données non fiables sont acceptées par une application web et transmises au navigateur sans validation appropriée. Cela permet à un attaquant de voler des cookies de session, d'exécuter des scripts malveillants, de rediriger vers des sites dangereux, etc. Étant donné que cette faille est très répandue, il est crucial de sécuriser notre site contre de telles attaques.

Par exemple dans notre application web, en entrant <script>alert('XSS');</script> dans un champ de formulaire, le script s'exécutera et affichera une alerte dans le navigateur.

==Méthode de protection==
Pour éviter cela, nous pouvons valider et échapper les entrées à la fois sur le front-end et le back-end :
Sur le front-end, on peut par exemple mettre en place une fonction validateForm() qui utilise une expression régulière pour détecter et empêcher les balises <script>.
Sur le back-end, on peut mettre en place des fonctions comme .replace() qui remplacerait les '<' ou '>' par d'autre caractères.

Nous n'avons pas intégré de sécurité contre cette vulnérabilité dès la conception dans ce cas car nous n'étions pas encore informés des vulnérabilités XSS lors de la conception de notre application web.

# 3ème Problème : Violation de contrôle d'accès

La violation de gestion de session consiste à exploiter un contrôle insuffisant ou inexistant pour accéder à des ressources sans autorisation. Au début du développement de notre site web, cette vulnérabilité majeure permettait à quiconque connaissant l'URL d'accéder à des pages restreintes, comme l'interface administrateur, en ajoutant simplement /admin à l'URL. Cela est extrêmement dangereux, car n'importe qui pouvait accéder à ces pages sans authentification préalable.
Par exemple un utilisateur peut se rendre sur la page admin juste en connaissant l'URL de la page admin.
Pour parer ce problème, on peut mettre en place des routes qui vérifient le statut de l'utilisateur.
Voici un exemple de route de vérification qui peut nous protéger contre cela :

```
router.get('/', function(req, res, next) {
    result = userModel.read(req.session.email, function(result) {
        if (!result[0] || result[0].type !== 'Administrateur') {
            res.redirect('/');
        }
        res.render('accueil_administrateur.ejs', { title: 'Administrer', user: result });
    })}
);
```

(Dans notre projet, le type Administrateur est 2 et non pas 'Administrateur' , nous avons laissé Administrateur pour qu'il illustre plus facilement notre exemple)
Ce système de session pourrait par exemple nous protéger contre cela. On pourrait aussi ajouter des fonction isAuthenticated qui vérifierait si l'utilisateur est authentifié et a les droits d'accès.

Nous pourrions évoquer aussi d'autres mesures de sécurité et de bonnes pratiques tel que le hachage de mots de passe dans la base de données, ne jamais stocker les mots de passe en clair ni les versions hachées non salées dans la base de données afin de protéger efficacement les informations sensibles des utilisateurs etc.
