# Tests

Il existe plusieurs types de tests logiciels. Nous parlons de tests unitaires et de tests d'intégration pour les tests qui concernant plus précisément le code. Nous parlons de tests fonctionnels pour les tests qui concernent plus précisément ce qui est attendu par le métier.

Les tests unitaires isolent des unités de code (par exemple une méthode) et vérifient le comportement du code en le rendant le plus possible indépendant de son environnement (on utilise pour cela des « mocks objects » qui permettent de simuler un composant : par exemple, on peut créer un mock object pour se comporter comme un accès à une base de données : ainsi le test n’échouera pas à cause d’un problème liée à la base de donnée).  
Les tests d'intégration vont au contraire tester un enchaînement d’opérations, par exemple depuis un clic sur une interface utilisateur jusqu'à une requête dans la base de données.

Les tests unitaires sont systématiquement exécutés lors des builds sur notre plateforme d'intégration continue. Les tests d'intégration peuvent éventuellement être exécutés indépendemment si leur exécution ralentit trop le build.

Globalement, l'écriture de tests permet de :

* __faciliter la compréhension du code__, de montrer comment ce dernier doit être utilisé. Chaque développeur(se) devrait pouvoir lire, comprendre ou modifier du code qu'il ait été écrit par lui / elle, que le code date de quelques jours ou de quelques mois.

* __d'avoir un filet de sécurité et de modifier le code en toute confiance__, d'assurer la non-régression du code. Les tests sont pour cela automatisés. Le développeur peut par exemple refactoriser le code (c'est-à-dire en réécrire des parties) sans avoir peur de le casser.

* __d'améliorer la conception du code__. Comme les TUs sont censés tester les composants logiciels indépendamment du reste du système, cela permet de découpler les composants afin de pouvoir les tester. Or le découplage des composants améliore la qualité du logiciel. Les TUs forcent les développeurs à réfléchir à ce que leur code est supposé faire. En écrivant les TUs avant le code (dans le contexte d’un développement piloté par les tests ou Test Driven Development), nous réfléchissons à comment une fonctionnalité (ou une API) sera utilisée et quel est le résultat qu’elle devra produire. Ce processus va aboutir à une conception logicielle simple qui va faire exactement ce qu’on attend d’elle.

## Tests unitaires en java

Le framework de test unitaire que nous utilisons est jUnit. Il permet de réaliser des suites de tests basés sur des assertions. Il bénéficie d'une bonne intégration avec Maven (pour automatiser l'exécution des tests) et avec l'IDE IntelliJ dans lequel on peut visualiser aisément les résultats.

## Tests unitaires en Javascript

Nous préconisons l'écriture de tests pour le code client produit avec le framework VueJs : https://vuejs.org/v2/guide/testing.html#Vue-Test-Utils

## Tests unitaires : bonnes pratiques

* Les tests unitaires doivent s’exécuter entièrement en mémoire (ne pas écrire des tests qui font des appels http, vers des DB ou vers le système de fichiers).
* Le nom du test unitaire doit être le plus parlant possible (par exemple comporter le nom de la méthode et de la condition à tester
* il faut utiliser l’assertion la plus appropriée (i.e. assertTrue pour tester une variable de type boolean)
* Mettre les paramètres dans la bonne ordre (i.e. assertTrue(expected, actual))
* Séparer le code de test du code de l’application (les sources dans src/main/java et les tests dans src/test/java)
* Instancier les membres de la classe de test dans la méthode @Before
* ne pas déclarer static les membres de la classe de test
* inutile d’entourer une méthode qui soulève une exception par un bloc try/catch, le framework jUnit s’en charge

## Tests fonctionnels

Les tests fonctionnels ne sont pas automatisés. Ils nécessitent des actions manuelles qui consistent à venir tester les fonctionnalités de l'application aux différentes étapes du cycle de vie du logiciel.

Les différents environnements permettant de réaliser des tests fonctionnels sont le suivants : 
- environnement de dev : cet environnement est ouvert aux développeurs et des tests fonctionnels basiques y sont réalisés par les développeurs eux même
- environnement de test : cet environnement est ouvert aux experts métiers de l'Abes et à des utilisateurs choisis parmis les réseaux de l'Abes ("parties prenantes" dans la terminologie Scrum), il permet de réaliser de tests fonctionnels avancés par les experts connaissant en détail le fonctionnement de l'application
- environnement de prod : comme son nom l'indique cet environnement est dédié à l'application qui tourne en production, il n'est pas destiné aux tests fonctionnels car les tests ont déjà été réalisé précédement. A notre cependant que des environnements de prod étiqueté "beta" peuvent être ouverts aux utilisateurs finaux et permettent de faire tester à grande échelle une application avant son ouverture officielle.
