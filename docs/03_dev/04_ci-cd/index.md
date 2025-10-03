# CI / CD

Cette section est dédiée à la manière dont l'Abes fait l'intégration (CI) et le déploiement continue (CD) de ses applications dans son système d'information.

## Intégration continue (CI)

L’intégration continue est un ensemble de pratiques de l'ingénierie logicielle qui poursuit deux objectifs :
* minimiser l’effort et le temps nécessaire à la phase d'intégration
* donner la possibilité à tout moment de livrer une version du code stable pouvant être déployée en production.

Ces objectifs sont atteints via la mise en place d'une pipeline composée d'un outil de gestion du code source vers lequel les développeurs vont soumettre ("commiter") leur code. A chaque modification, un outil de "build" récupère le code, exécute les tests unitaires et d'intégration et construit le composant (compilation). Le code est ensuite envoyé vers l'outil de vérification de la qualité du code. Le composant compilé est enfin publié sur un dépôt des artefacts (référentiel binaire). Enfin, les développeurs sont informés du résultat du build, qu'il ait réussi ou non.


### Bénéfices de l'intégration continue

L'intégration continue a de nombreux bénéfices :

* __Pour les développeurs__
  * Le débogage du code est facilité car les erreurs sont associées à des petites incrémentations du code. La correction des bugs est faite avant l’accumulation des erreurs interférant les unes avec les autres. Le risque lié à l’intégration d’une quantité de code trop importante au moment de la fin du projet est écarté car le code est dans un état vérifié et exécutable à tout moment.
  * le retour du cycle de développement est réduit donc des distributions applicatives fréquentes sont possibles
  * le risque de conflits de fusion du code source est réduit et la résolution de ces conflits est simplifiée car les fusions sont fréquentes
  * l’automatisation de l’exécution des tests unitaires et la réalisation des distributions permet d’obtenir une meilleure qualité du code et améliore la productivité. Une bonne couverture du code par les tests unitaires offre aux nouveaux développeurs un environnement sûr pour rapidement comprendre le code.
  * les développeurs ne passent plus leur temps dans des tâches de débogage, fusion du code source, déploiement, etc. Ce temps peut alors être utilisé pour améliorer le code via par exemple des tâches de refactoring (modifier le code non pour ajouter une fonctionnalité mais pour améliorer sa structure)

* __Pour le management__
  * réduire les risques et le temps de distribution des applications
  * réduire les coûts de développement et déploiement
  * améliorer la qualité du code source

* __Pour les utilisateurs__
  * les utilisateurs peuvent à tout moment évaluer le produit qui est dans un état stable

L'intégration continue facilite les déploiements fréquents, notamment si elle est couplée à l'utilisation d'une méthode agile. On peut par exemple définir un sprint de quinze jours sur un projet : les fonctionnalités développées lors de ce sprint sont déployées en test. Si les tests sont concluants, on peut ensuite intégrer les nouvelles fonctionnalités à la version en production qui sera déployée dans la foulée.

### Plateforme d'intégration continue open source

Notre plateforme d'intégration continue open source en place depuis 2019 est constituée de :

* [__GitHub__](https://github.com/abes-esr/) est le gestionnaire de codes sources. Il fournit une interface web qui permet de naviguer dans les différents projets, d’effectuer des recherches dans le code.
* __GitHub Action__ qui sert à compiler les sources, lancer les tests, générer les versions, et générer les images docker (artefacts) des applications.
* [__DockerHub__](https://hub.docker.com/u/abesesr) qui sert à stocker et à distribuer les images docker de nos applications une fois compilées par les GitHub Actions. Les images docker sont alors prêtes à être déployées en local, dev, test, et prod.
* [__WatchTower__](https://containrrr.dev/watchtower/) qui sert à déployer automatiquement les applications docker sur les environnements dev, test, et prod.
* [__Maven Central__](https://search.maven.org/search?q=abes) qui est le gestionnaire de dépôts de librairies JAVA pour tous nos développements opensource depuis 2019 (remplace donc le Artifactory interne)
* [__GitGuardian__](https://www.gitguardian.com/) qui sert à détecter d'éventuelles secret qui pourraient fuitter dans les commits envoyés en opensource sur GitHub.


Une modification logicielle va suivre le circuit suivant au sein de cette plateforme : 
- le développeur commit du code dans un dépôt github (via une pull request en général), par exemple sur ce dépôt https://github.com/abes-esr/abes-hello-back/
- ce commit va déclencher une github action nommée [`build-test-pubtodockerhub.yml`](https://github.com/abes-esr/abes-hello-back/blob/develop/.github/workflows/build-test-pubtodockerhub.yml) qui va se charger de dérouler plusieurs étapes décrites dans un [`Dockerfile`](https://github.com/abes-esr/abes-hello-back/blob/develop/Dockerfile) (cf [exemple des logs d'un job de cette github action](https://github.com/abes-esr/abes-hello-back/actions/runs/15872274305/job/44751458708)): 
  - compiler le code source de l'application
  - lancer les tests automatique de l'application
  - construire une image docker de l'application
  - publier l'image docker de l'application sur dockerhub (cf https://hub.docker.com/r/abesesr/abes-hello/)
- ce commit va également déclencher en parallèle l'analyse des éventuelles fuites de secret avec l'outil GitGuardian, par exemple sur cette PR : https://github.com/abes-esr/abes-hello-back/pull/92/checks?check_run_id=44770987685

Dans le cas de la création d'une release, le circuit est similaire. Voir ces sections : "Nommage des images docker" et "Publier une nouvelle release d'une application"

L'étape suivante consiste au déploiement de l'application, voir pour cela la section suivante "Déploiement continu"

### Ancienne plateforme d'intégration continue

Notre ancienne plateforme d'intégration continue est constituée de

* __Gitlab__ est le gestionnaire de codes sources. Il fournit une interface web qui permet de naviguer dans les différents projets, d’effectuer des recherches dans le code. Il propose aussi des fonctionnalités de wiki et de gestionnaire de tickets. A noter que nos nouveaux codes sont déposés sur __Github__ qui fournit des fonctionnalités similaires à Gitlab.
* __Jenkins__ qui sert de chef d’orchestre. Son travail est de récupérer les sources sur Gitlab, de les compiler avec Maven, de lancer une analyse SonarQube et d’enregistrer la compilation dans Artifactory. Si l’on souhaite un déploiement en DEV, TEST ou PROD, PUPPET prendra le relais.
* __Artifactory__ permet de sauvegarder dans un même lieu l’ensemble des dépendances de chaque projet ainsi que la compilation de chacun. Il permet également de gérer les « releases » (versions stables d’une application) et les « snapshots », compilation à un instant « t ».
* __SonarQube__ analyse le code en y appliquant un ensemble de règles permettant de vérifier que les standards sont respectés en termes de conventions de codage, sécurité etc.
* __Puppet__ déploie sur les machines de DEV, TEST et PRODUCTION à partir d’un langage spécifique. Les scripts de déploiement Puppet ne sont pas stockés avec le code source des applications mais dans un dépôt à part. Une grande partie de ce code a été factorisé et est partagé par les applications. Ainsi le code puppet spécifique à chaque application est minimisé et il s'agit principalement de configuration.


### Perspectives de l'intégration continue

La configuration de la plateforme d'intégration continue est réalisée par l'équipe des développeurs et l'équipe infrastructure de l'Abes. La mise en place d'un workflow open source depuis 2019 engendre des évolutions importantes dont certaines briques restent à traiter comme par exemple la documentation technique d'une application (non ouverte à la date d'octobre 2022).











## Déploiement continu (CD)

La phase de déploiement continu de la motification d'une application prend la suite de la phase d'intégration continue :
- lors de la phase d'intégration continue, la modification de l'application a généré une nouvelle image docker qui a été publiée sur dockerhub en respectant un système de nommage (cf section sur le nommage des images docker)
- la phase de déploiement de la motification de l'application prends alors la suite.
  - Les paramètres dédiés au déploiement de l'applications (docker-compose.yml et .env) doivent être opérationnels (cf partie "Déploiement d'une application docker") et l'application doit avoir été démarrée manuellement une première fois sur au moins un environnement (dev,test ou prod).
  - Ensuite c'est l'outil [WatchTower](https://containrrr.dev/watchtower/) qui prends le relais. Watchtower est un conteneur docker qui fait partie des conteneurs d'une application. Il vérifie toutes les 60 secondes (c'est la valeur par défaut utilisée) si une nouvelle image docker de l'application est disponible sur DockerHub.
  - Si une nouvelle image docker de l'application est disponible sur DockerHub, alors WatchTower va se charger de la déployer. Pour cela il va télécharger la nouvelle image, puis il va arrêter et supprimer le conteneur de l'application à mettre à jour (celui qui correspond à la nouvelle image), puis il va créer un nouveau conteneur avec cette nouvelle image en injectant les mêmes paramètres du précédent conteneur, enfin il va notifier qu'il a réalisé ce déploiement sur un canal slack (cf FAQ "Notification slack des déploiements réalisés avec watchtower")

### Configuration de watchtower

La configuration de watchtower pour permettre le déploiement automatique des nouvelles versions des images des conteneurs d'une application se sépare en deux parties.

La première consiste à lancer un conteneur watchtower au sein de l'application, voici l'[exemple sur hello-abes](https://github.com/abes-esr/abes-hello-docker/blob/05c1038233a5385a6a535685877e96fe931d9093/docker-compose.yml#L206-L236).

La seconde consiste à signaler à watchtower quels sont les conteneurs que l'on souhaite qu'il mette à jour si une nouvelle image docker de ce conteneur est détectée par watchtower, cela se passe par un système de labels, voici l'[exemple avec le label à positionner sur un conteneur](https://github.com/abes-esr/abes-hello-docker/blob/05c1038233a5385a6a535685877e96fe931d9093/docker-compose.yml#L65-L66) et la [correspondance via le nommage du label dans la configuration de watchtower](https://github.com/abes-esr/abes-hello-docker/blob/05c1038233a5385a6a535685877e96fe931d9093/docker-compose.yml#L235-L236).


### Déploiement en production : checklist

Le déploiement en production d'une application est une opération sensible car une erreur pourrait pénaliser de nombreux utilisateurs finaux et générer un travail de support et d'assistance important. Cette partie est dédiée à une check list de chose à penser à faire avant la mise en production d'une application.

- s'assurer que l'application est correctement sauvegardée et pour cela réaliser un test de restauration de l'application et vérifier que la procédure est documentée dans la fiche d'exploitation de l'application
- dans le cas de la mise à jour d'une application, réaliser une sauvegarde de cette application juste avant le déploiement en production
- vérifier que les logs de l'applications remontent correctement dans le puits de logs de l'Abes
- vérifier que l'application est bien surveillée dans la météo des applications de l'Abes (outil uptimerobot)
- dans le cas d'une application web, vérifier que les statistiques d'usage remontent correctement (outil matomo)
