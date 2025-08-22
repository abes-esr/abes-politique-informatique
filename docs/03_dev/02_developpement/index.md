# Développement

## Gestion du code source

Pour gérer nos codes sources, nous utilisons majoritairement [Github](https://github.com/abes-esr) comme gestionnaire de code open source (ou SCM pour source control management) associé à notre plateforme d'intégration continue (cf partie ci/cd).

### Licence

Tous les nouveaux projets créés par l'Abes depuis 2019 produisent du code opensource.

Nous appliquons la [Licence CeCILL](https://fr.wikipedia.org/wiki/Licence_CeCILL) : c'est une licence équivalente à la GPL compatible avec le droit Français et [préconisée par la loi pour une République numérique](https://www.data.gouv.fr/fr/licences). Elle est donc "contaminante", c'est à dire qu'elle impose aux contributeurs de publier les modifications/améliorations réalisées sous la même licence. Cette licence est [positionnée dans l'application Hello Abes ici](https://github.com/abes-esr/abes-hello-front/blob/develop/LICENSE) et peut être prise comme exemple pour les nouvelles applications.  

Les [bibliothèques de logiciels](https://fr.wikipedia.org/wiki/Biblioth%C3%A8que_logicielle) ("librairies") développées sont elles publiées sous la [licence MIT](https://fr.wikipedia.org/wiki/Licence_MIT) qui permet une réutilisation moins contraignante et donc plus adapté à la nature de ces  codes.

### Forge logicielle : github


Github et Gitlab fournissent une interface web qui :
* donne accès aux fichiers, aux commits, à un moteur de recherche sur le code source
* propose un éditeur de code en ligne
* permet de suivre facilement les modifications apportées par les développeurs
* permet de visualiser l'activité de chaque développeur.
* donne accès un tableau de type Kanban qui nous permet de gérer les sprints lorsque le projet est mené en méthode agile. Un atout de ce tableau est de pouvoir lier les tâches aux commits.

Pour tous les développements réalisés par l'Abes depuis 2019, c'est Github qui est utilisé pour permettre la publication en open source. Le GitLab interne de l'Abes n'est plus utilisé pour les nouveaux développements.


### Numéros de version : semver


Le projet est une succession d’itérations : demande de fonctionnalités, implémentation, correction des bugs etc. Ces évolutions sont reflétées par les numéros de version des projets.

Nous utilisons la notation `X.Y.Z`, préconisée par le semantic versioning : https://semver.org/spec/v2.0.0.html

- `X` correspond à une version majeure du système. Cette mise à jour peut potentiellement provoquer des incompatibilités par rapport aux versions précédentes.
- `Y` correspond à une version mineure, ce numéro est incrémenté lors d'ajouts de fonctionnalités.
- `Z` est le numéro du build, il est incrémenté par exemple lors de la correction d'un ensemble de bugs ou de la factorisation d'une partie du projet.


Enfin, nous distinguons les release et les snapshot. Pour les snapshot, les numéros de version sont suffixés par `-SNAPSHOT`. Rien n'est ajouté au numéro pour les releases. Un snapshot est la version en cours de développement (branche git `develop`).

Une release correspond à l'état stable d’une version. Si par exemple la construction de la `2.0.6` est lancée en release, le numéro de version pour le snapshot suivant est incrémenté et devient `3.0.0` ou `2.1.0` ou `2.0.7`. Ce fonctionnement est automatisé pour Java via l'utilisation de Maven et pour VueJS via l'utilisation de Npm.

A chaque release correspondant le tag Git ayant la même valeur `X.Y.Z` posé sur la branche `main` du code source.


### Utilisation des branches : gitflow

Nous utilisons un système de branches inspiré de [Gitflow](https://www.atlassian.com/fr/git/tutorials/comparing-workflows/gitflow-workflow) : nous avons donc systématiquement deux branches :
- `main` :
    - version tagguée pour déploiement sur l'env de production (tag `X.Y.Z`)
    - et version non taggée pour l'env de test (version "glissante")
- `develop` : version pour l'env de développement (version "glissante")

Lorsqu'on souhaite ajouter une fonctionnalité, on crée une nouvelle branche du nom de la fonctionnalité (feature/nomDeLaFonctionnalité ou sous JIRA `<n°ticket JIRA/nomDeLaFonctionnalité>`) à partir de la branche `develop`. Une fois que cette fonctionnalité a été testée, une pull request (appelé aussi merge request) est créée. Un autre développeur prends alors connaissance du code (review), la branche est ensuite fusionnée sur la branche `develop`.

On peut également corriger un bug dans la version en production sans toucher à la version en développement. On dérive alors une branche `hotfix` de la branche `main`. Une fois validée, la correction est fusionnée sur la branche `main` et également fusionnée sur la branche `develop`. Une nouvelle release est alors générées en incrémentant le numéro `Z` (cf `X.Y.Z`) et la release intégrant cette correction peut être déployée sur l'env de production.

Pour passer en production tout le travail présent sur la branche `develop`, il faut fusionner `develop` sur `main` puis [créer une release sur `main`](#publier-une-nouvelle-release-dune-application) et déployer cette release sur l'env de production.

Dans le cadre l'opensource, les release sont mises en oeuvre via une Github Action nommée create-release.yml que l'on peut voir sur l'application "Hello World" de l'Abes :
https://github.com/abes-esr/abes-hello-back/blob/main/.github/workflows/create-release.yml
Cf à suivre procédure ci-dessous.

Parallèlement, l'Abes maintient un système de génération de release au niveau de sa plateforme interne Jenkins qui est destiné à être remplacé par les Github Actions.

Parmi les bonnes pratiques à suivre en complément du workflow [Gitflow](https://www.atlassian.com/fr/git/tutorials/comparing-workflows/gitflow-workflow) on peut citer :

* ne pas attendre (maximum deux semaines) pour merger une branche et la branche dont elle est dérivée (par exemple une "feature" sur `develop`). En général, la durée maximale est celle du sprint.
* les commits doivent obligatoirement être accompagnés d'un certain nombre d'informations (voir ci-dessous la section spécifique aux messages de commit).
* il faut toujours lancer les tests unitaires en local avant de commiter le code.
* privilégier un découpage de projet en modules permet d'avoir des commits les plus indépendants les uns des autres. Lorsqu'on travaille à plusieurs, on limite ainsi le risque de modifier les mêmes parties du code.
* à chaque correction de bug, il faut ajouter le test unitaire qui, s'il avait existé, aurait permis d'éviter le bug.
* tout le code impacté par un ajout de fonctionnalité ou une correction doit être commité en une seule fois. Si plusieurs fonctionnalités ou bugs sont impactés, il est donc recommandé de réaliser plusieurs commits, chacun correspondant à une modification.
* il faut utiliser le fichier `.gitignore` pour exclure systématiquement des commits tout ce qui est spécifique à l’IDE (`.classpath`, `.project`), le répertoire avec le code compilé : target et les fichiers `.properties` lorsqu'on travaille sur Github.
* le code compilé ne doit pas être envoyé sur Github (puisque les sources suffisent à créer le programme)
* les dépendances externes ne doivent pas être envoyées sur Github (elles sont dans le repository manager : `pom.xml` pour Java et `package.json` pour VueJS)
* Pour les codes PL/SQL : l'ajout de code PL/SQL doit être limité autant que possible car ce code n'est pas versionné et son debuggage est compliqué. Du code externalisé est à privilégier lorsque c'est possible. A noter qu'une tâche périodique est en place et parcourt tous les scripts PL/SQL de la base Oracle de l'Abes et les versionne en vrac dans un dépôt git interne spécifique. Il est aussi possible d'exporter manuellement le code depuis l'IDE sqldeveloper sur son poste en local en fichiers `.sql` (qui contient fonctions, procédures, types, DDL). Ces fichiers sont alors regroupés dans un répertoire "sql" dans le projet et sont versionnés avec le code de l'application.
* procéder de la même manière que pour le PL/SQL pour tout code susceptible d’être stocké dans des tables de base de données (fichiers XSL, XQuery etc.)
* il faut ajouter des fichiers release-notes à chaque release. A noter que dans le cadre de la chaine de build opensource, ce sont les intitulé des Pull Request qui sont utilisés pour auto-générer le changelog de la release (exemple sur la [release 1.0.0 de licencesnationales-front](https://github.com/abes-esr/licencesnationales-front/releases/tag/1.0.0)).
* Nous utilisons les "pull request" sur Github ("merge request" sur Gitlab) : les branches `main` et `develop` n'acceptent que les "merge" et non les "push". Les "merge" sont conditionnés à l'approbation d'au moins un autre développeur. Cette pratique permet de renforcer la qualité du code (relecture) et de partager le code produit.


### Publier une nouvelle release d'une application


Voici la procédure à appliquer pour publier une nouvelle release (nouvelle version) d'une application open-source produite par l'Abes :
1. S'assurer que le code que l'on souhaite passer en production est bien présent sur la branche `main` (procéder à la fusion manuelle de la branche `develop` vers `main` si besoin)
2. Se rendre sur l'onglet "Actions" sur le dépôt github  
   ![image](https://user-images.githubusercontent.com/328244/159044287-67c7131f-8663-4452-b7fa-55aa8c695692.png)
3. Cliquer sur le workflow "Create release"  
   ![image](https://user-images.githubusercontent.com/328244/159044427-d36ae0d6-51cc-4f69-a855-097c162ba100.png)
4. Cliquez ensuite sur "Run workflow" sur la droite  
   ![image](https://user-images.githubusercontent.com/328244/159044539-57b57fba-15b8-440d-94e7-1ee859566a04.png)
5. Choisisez la branche `main` et indiquez ensuite le numéro de la version à générer (doit respecter le [semantic versioning](#numéros-de-version)) après avoir vérifié que votre numéro de version n'existe pas déjà (sinon l'action github échouera)  
   ![image](https://user-images.githubusercontent.com/328244/159044729-e9cc0d7a-abe3-401f-a246-84e577670493.png)
6. Validez et attendez que le build se termine. Le fait de lancer le workflow create-release.yml va provoquer deux choses :
- le workflow `build-test-pubtodockerhub.yml` va se déclencher dans la foulée (cf le code du [workflow "build-test-pubtodockerhub" sur abes-hello](https://github.com/abes-esr/abes-hello-back/actions/workflows/build-test-pubtodockerhub.yml),
- et une nouvelle image docker de l'application sera alors publiée avec comme tag docker le numéro de version de votre release (cf le  [dépôt docker hub de abes-hello](https://hub.docker.com/r/abesesr/abes-hello/)


### Messages de commit


Un soin particulier doit être apporté à la rédaction des messages de commit. Pour les dépôts Github, la langue privilégiée est l'anglais.

* il faut être le plus spécifique possible, par exemple "Correction du bug login" devient "Redirection de l’utilisateur vers la page adaptée après le login"
* si plusieurs points doivent mentionnés, il est possible de les présenter sous forme de listes via * ou -
* il faut écrire un court paragraphe d'explication en plus du titre
* le lien entre le commit et le ticket se fait en ajoutant le numéro du ticket au message sous le format : #NumeroDuTicket (voir exemple plus bas)
* chaque commit doit être typé :
    * Fix : Correction de  bugs
    * Feat : Nouvelles fonctionnalités
    * Doc : Ajout de documentation
    * Test : Ajout de tests unitaires
    * Refactor : Refactorisation ou nettoyage de code existant, sans impact sur les fonctionnalités

Un message de commit doit donc être structuré ainsi :

#NumeroISSUE Type : Message du commit

Court paragraphe décrivant les modifications plus en détail si nécessaire



### Création et configuration d'un nouveau dépôt


La création de dépôt opensource sur GitHub doit être privilégiée. La création de dépôt sur GitLab (interne à l'Abes) est utile dans certain rares cas (dépôt contenant des secrets, réorganisation de vieux codes).

Voici la procédure pour la création de dépôt Git :
* les noms des dépôts Git doivent être en minuscule, les éléments séparés par des tirets. Chaque dépôt doit posséder, dès sa création, une description ainsi qu'un `README.md` minimaliste pour donner dès le début un cadre au contenu attendu dans le dépôt (même si ce dernier est vide dans un premier temps).
* les demandes de création de dépôt doivent être transmises à l'alias `github@abes.fr` qui assure le maintien de la cohérence dans le nommage des dépôts.
* se loguer en utilisateur admin `abes-dev` pour Github (ou `depot`pour le Gitlab interne Abes)
* ajouter une description

Une fois le dépôt créé :
* ajouter un `README.md` (et le renseigner)
* ajouter un `.gitignore`
* créer une branche `develop`
* dans les settings du dépôt, dans "Manage access" pour Github ou "Members" pour Gitlab : inviter les développeurs, leur attribuer un rôle (maintainer ou developers)
* dans "Settings / Branches" pour Github ou "Settings / repository" pour Gitlab, il faut protéger les branches ainsi:
    * `main` : allowed to push : no one, allowed to merge : maintainers + developers
    * `develop` : allowed to push : maintainers + developers, allowed to merge : maintainers + developers
    * `develop` : la positionner comme la branche par défaut, ainsi quand on clone le dépôt depuis zero et qu'on veut créer une branche pour ajouter une fonctionnalité, cela limite les erreurs et permet de créer les PR sur la branche develop et pas sur la branche main


### Codes partiellement ouverts sur Github

Les dépôts Github publiés par l'Abes qui contiennent du code qui dépend de librairies non opensource (car pas encore libérées par l'Abes) doivent le mentionner dans le `README.md` du dépot par la mention suivante :
> Attention : ce code (open)source, développé et maintenu par l'Abes ne peut pas (encore) être réutilisé à l'exterieur car il dépend de librairies internes. Contactez nous (github@abes.fr) si vous souhaitez y contribuer.

Ainsi les collègues contributeurs externes à l'Abes sont prévenus rapidement et cela leur évite de perdre du temps à essayer de compiler/réutiliser le code.

### Codes ESR ouverts et partagés sur Github

Le github https://github.com/abes-esr/ regroupe également les codes sources des applications développées par les établissements des réseaux de l'Abes qui souhaitent les partager au niveau national à tout l'ESR (cf [présentation ici](https://punktokomo.abes.fr/2019/06/18/une-politique-informatique-ouverte-pour-labes/)).

A noter que l'Abes n'impose pas aux établissements de respecter la politique de développement de l'Abes pour ne pas imposer des contraintes trop fortes. En revanche l'Abes demande de respecter quelques règles :
- des règles de nommage du dépôt et la présence d'un README même minimaliste décrivant le contenu du dépôt (cf [cette section](https://politique-developpement.abes.fr/docs/Architecture%20des%20projets#nom-dun-projetapplication) et [cette section](https://politique-developpement.abes.fr/docs/Gestion%20du%20code%20source#cr%C3%A9ation-et-configuration-dun-nouveau-d%C3%A9p%C3%B4t))
- une licence open source (l'établissement peut si besoin s'inspirer des [choix de l'Abes](https://politique-developpement.abes.fr/docs/Gestion%20du%20code%20source#licences))

En option, l'Abes propose aux établissements un espace pour communiquer sur leur code source/application dans le [blog technique de l'Abes](https://punktokomo.abes.fr/) via un article (voici un [exemple](https://punktokomo.abes.fr/2019/10/08/sudoctoolkit-une-application-pour-faciliter-lutilisation-des-web-services-de-labes/))

Pour faire une demande de dépôt de code source dans le github de l'Abes, les établissements sont invités à utiliser le guichet d'assistance de l'Abes : https://stp.abes.fr











## Stack technique

Nous préconisons l'utilisation des technologies suivantes pour développer les outils et applications de l'Abes :
- Java : pour la partie serveur (les api et les batch) de l'application
- Javascript : pour la partie cliente (les front) de l'application
- Elasticsearch : pour le moteur de recherche de l'application
- Postgresql : pour la base de données de l'application
- Docker : pour le packaging de l'application
- Docker compose : pour le déploiement de l'application

Nous préconisons d'utiliser les langages de programmation (Java et Javascript) en y associant un framework. Les framework sont des cadres de développement qui permettant de définir de manière standardisée l'architecture d’une application. Les développeurs peuvent focaliser leur travail sur la conception de la couche métier de l’application, le framework prenant en charge un ensemble de tâches techniques récurrentes telles que :

* l'accès aux données
* l'internationalisation
* la journalisation des événements (logging)
* la sécurité (authentification et gestion des rôles)
* le paramétrage de l'application

La mise en oeuvre d'un framework permet notamment :

* de capitaliser le savoir-faire sans "réinventer la roue"
* d'accroître la productivité des développeurs une fois le framework pris en main
* d'homogénéiser les développements des applications en assurant la réutilisation de composants fiables
* de faciliter la maintenance notamment évolutive des applications

### Framework Spring pour les applications serveurs (Java)

Le framework qui s'est imposé ces dix dernières années dans le monde Java est Spring. Il est très largement utilisé dans le monde Java, ce qui en fait un standard de fait et constitue une certaine garantie sur la pérennité du framework. Spring propose une très bonne intégration avec d'autres frameworks open source comme Hibernate ou des standards de Java (Servlets, JMS, JDO etc.) Toutes les fonctionnalités de Spring peuvent s'utiliser dans un serveur Java EE et pour la plupart dans un simple conteneur web ou une application standalone.

Les fonctionnalités offertes par Spring sont très nombreuses et les sujets couverts ne cessent d'augmenter au fur et mesure des nouvelles versions et des nouveaux projets ajoutés au portfolio.

La documentation de Spring est complète et régulièrement mise à jour lors de la diffusion de chaque nouvelle version. La mise en oeuvre de Spring n'est pas toujours aisée, car il existe généralement plusieurs solutions pour implémenter une fonctionnalité. Nous essayons autant que possible de réutiliser des architectures validées dans nos différents projets.

A noter qu'il n'est pas rare que les livrables aient une taille importante du fait des nombreuses librairies requises par Spring et ses dépendances.

### Framework VueJs pour les applications clientes (CSS/Javascript)

Les frameworks Javascript permettent de construire des applications s'exécutant essentiellement dans le navigateur web en minimisant les échanges avec la partie serveur. Ce fonctionnement permet d'obtenir une expérience utilisateur plus fluide et riche. Côté développeur, ces frameworks ajoutent une couche d'abstraction qui manquait dans l'univers Javascript.
Actuellement les frameworks Javascript les plus populaires sont React, Angular et VueJs.  
Nous avons fait le choix de VueJs pour sa légèreté et facilité à prendre à main. Nous utilisons également Vuetify qui propose une galerie de composants graphiques.
Ce framework implémente le modèle MVVM (modèle-vue-vue-modèle) via un système de binding qui permet d'échanger instantanément des données entre le modèle et la vue.

#### Technique du "cache busting" pour les applications clients pas encore en VueJS

Il est préconisé de mettre en place la technique du [cache busting](https://www.keycdn.com/support/what-is-cache-busting) pour les applications HTML/CSS/JS qui n'utilisent pas encore VueJS. Cette technique permet de palier les problèmes de mise en cache des "vieilles" ressources statiques (CSS/JS) lorsque l'on publie une nouvelle version de l'application (et évite par exemple de demander aux utilisateurs de faire CTRL+F5 pour avoir la bonne version des ressources). Cette technique consiste à ajouter le numéro de version ou le hash du dernier commit dans l'URL de la CSS/JS au moment de l'inclusion ou bien d'y indiquer une valeur arbitraire qui est modifiée au moment où la ressource statique CSS/JS a été modifiée.

Voici un exemple sur IdRef avant la mise en place du cache busting :
```html
<link rel="stylesheet" type="text/css" href="css/style.css" title="style" media="screen"/>
```

Et voici ce que cela donne après la mise en place du cache busting :
```html
<link rel="stylesheet" type="text/css" href="css/style.css?v1" title="style" media="screen"/>
```










## Normes de codage


Un code de bonne qualité est un code dont le coût d’implémentation est constant sur tout le cycle de développement. Nous constatons que la maintenance du code est l'étape :

* où souvent seuls quelques développeur(se)s sont à même de comprendre le code et de le modifier sans crainte
* où le temps nécessaire pour implémenter une évolution est le plus difficile à estimer
* où les régressions sont fréquentes

Il est donc particulièrement important d'essayer de contrôler avec le plus de finesse cette notion de qualité.

* L’analyse de la qualité du code se concentre sur :
  * le respect des standards et des bonnes pratiques de développement
  * l'absence de commentaire dans le code et de rédaction de documentation
  * la duplication des lignes de code
  * l'existence des composants complexes et/ou une mauvaise distribution de la complexité entre les composants
  * une mauvaise couverture du code par tests unitaires surtout sur les parties complexes du code
  * l'existence des bugs potentiels, les problèmes de performance et de sécurité
  * l'existence du code "spaghetti".

Nous mettons donc en œuvre une analyse statique du code (ASC). ASC consiste en une collection d’algorithmes qui permettent de rechercher de manière automatique les bugs potentiels et les mauvaises pratiques de développement. L’ASC appelée aussi "white-box testing" analyse une application de manière statique (et non pendant son exécution). C’est la seule manière de couvrir tout le code afin d’identifier les points vulnérables. Les tâches réalisées par l’ASC sont divisées en trois catégories :
* Détection des erreurs dans le code
* Recommandations sur le formatage du code (en fonction des règles de formatage définies au sein de l’ABES)
* Calcul des métriques du code. Les métriques du logiciel représentent des valeurs numériques des caractéristiques du code ou de ses spécifications


### SonarQube

Il existe quelques outils d’ASC reconnus (et historiques) tels que Checkstyle (Focus sur les conventions de codage), PMD (Focus sur les mauvaises pratiques de codage) ou encore FindBugs (Focus sur les bugs potentiels et les problèmes de performance). La plupart de ces outils sont disponibles sous forme de plugins dans SonarQube.

SonarQube est un outil open source qui collecte et analyse le code source en en mesurant la qualité et en fournissant des rapports de qualité. Il peut analyser plus d’une vingtaine des langages de programmations, dont Java, Javascript et PL/SQL (option payante). Il combine l’analyse statique et dynamique du code. Tout ce qui concerne le code (détails mineurs de style ou erreurs critiques de conception) est inspecté par SonarQube et mis à disposition des développeurs. Chaque couche de l’application (du composant à la classe) est analysée.

SonarQube offre :
* assemblage des fonctionnalités de Checkstyle, PMD et FindBugs dans un seul outil (tout-en-un) utilisable dans la chaîne d’intégration continue (intégration facile avec Jenkins)
* intégration facile avec l’IDE intellij via le plugin SonarLint
* un tableau de bord pour mesurer la qualité du code de l’ensemble des projets de l’ABES
* focus non seulement sur les bugs, mais aussi sur les règles de codage, couverture des tests unitaires, duplication du code, documentation des APIs, complexité, conception
* des métriques pour aider à la prise de décisions. Les métriques et les statistiques sont traduites en termes de risque et dette en développement. Cela permet aux chefs de projet et aux managers d’avoir une vision transparente et continue (à jour) sur la qualité des applications, en leur fournissant en même temps l’accès à l’historique des changements.
* la centralisation des règles de codage dans un seul endroit, sur SonarQube, ce qui facilite la maintenance du dépôt des règles et l’utilisation des mêmes règles par tous les développeurs


Les règles utilisées par SonarQube sont consultables ici : https://rules.sonarsource.com/java

Elles sont détaillées par langage utilisé, par type de problème (performance, sécurité, etc.). Chaque règle contient une définition, des exemples conformes/non-conformes et la sévérité.

* La mise en conformité du code par rapport aux conventions de codage d’écrites par SonarQube doit se faire en amont au niveau d’Eclipse (recommandé pour tous les développeurs), certaines actions de formatage se font automatiquement lors de l’enregistrement du code :
* La langue anglaise est recommandée pour tout ce qui est commentaires, nom de classes/méthodes/membres, javadoc, nommage de fichiers de log, mais le français est toléré.











## Applications dockerisées

### Structure d’une application dockerisée

Une application dockerisée respecte plusieurs règles :
- l'application possède un dépôt pour son code source et c'est ce même dépôt qui est chargé de générer et de publier son image docker.
  - ce dépôt contient le `Dockerfile` de l'application dont l'objectif est de produire l'image docker de l'application pour qu'elle soit ensuite prête à être exécutée (ex: sur [abes-hello-back](https://github.com/abes-esr/abes-hello-back/blob/develop/Dockerfile))
  - le `Dockerfile` de l'application execute également les tests de l'application ce qui permet d'éviter de produire une image docker embarquant un code qui ne fonctionne pas (exemple de paramétrage maven sur [abes-hello-back](https://github.com/abes-esr/abes-hello-back/blob/develop/Dockerfile#L27))
  - ce dépôt contient une github action souvent nommée `build-test-pubtodockerhub.yml` (ex: sur [abes-hello-front](https://github.com/abes-esr/abes-hello-front/blob/develop/.github/workflows/build-test-pubtodockerhub.yml)) permettant de construire l'image Docker et de la publier sur l'[espace abesesr sur dockerhub](https://hub.docker.com/orgs/abesesr).
  - ce dépôt contient une github action souvent nommée `create-release.yml` (ex: sur [abes-hello-front](https://github.com/abes-esr/abes-hello-front/blob/develop/.github/workflows/create-release.yml)) permettant de créer une nouvelle version/release de l'application
- l'application peut avoir besoin de plusieurs images docker, par exemple pour le front en vuejs (ex: [abes-hello-front](https://github.com/abes-esr/abes-hello-front/blob/develop/.github/workflows/build-test-pubtodockerhub.yml)), ou pour l'API en java Spring (ex: [abes-hello-back](https://github.com/abes-esr/abes-hello-front/blob/develop/.github/workflows/build-test-pubtodockerhub.yml))
- l'application possède un dépôt dédiée à son déploiement avec `docker-compose`, cf section suivante.

### Nommage des images docker

Pour nommer les images docker publiées sur [DockerHub abesesr](https://hub.docker.com/u/abesesr), nous privilégions cette nommenclature :
- `<organisationdocker>/<nomapplication>:<nom-branche|numero-version>-<module-applicatif>`
- exemple pour l'image docker du front de l'application `abes-hello` sur sa branche `develop` : `abesesr/abes-hello:develop-front`
- exemple pour l'image docker des batchs de l'application `abes-hello` sur sa branche `develop` : `abesesr/abes-hello:develop-batch`
- exemple pour l'image docker du front de l'application `abes-hello` sur sa branche `main` : `abesesr/abes-hello:main-front`
- exemple pour l'image docker du front de l'application `abes-hello` sur sa release `1.0.0` : `abesesr/abes-hello:1.0.0-front`


### Déploiement d'une application docker

Un dépôt github dédié au déploiement doit être créé pour l'application. La règle de nommage de ce dépôt est de commencer par le nom de l'application et de terminer par le suffix `-docker` (ex: [abes-hello-docker](https://github.com/abes-esr/abes-hello-docker)). Il permet à n'importe qui sur le web de venir tester l'application sur son environnement local ou sur son serveur. Ce dépôt permet de faciliter la réutilisation et les contributions externes.

Les éléments obligatoires de ce dépôt sont :
- le fichier `docker-compose.yml` : c'est la liste de tous les conteneurs et leurs configurations/articulations utilisés par l'application. Des règles doivent être respectées, cf paragraphe plus bas.
- le fichier `.env-dist` : c'est un fichier contenant les paramètres de l'application avec des exemples de valeurs. Il est destiné à être copié vers un fichier `.env` au moment de l'installation initiale de l'application et à personnaliser son contenu (ex: mot de passe d'une base de données, chaine de connexion etc ...)
- le fichier `README.md` : c'est la fiche d'exploitation de l'application qui explique comment installer, démarrer, stopper, superviser et sauvegarder l'application (ex: sur [abes-hello-docker](https://github.com/abes-esr/abes-hello-docker#readme)).

Le fichier docker-compose.yml de l'application décrit tous les conteneurs de l'application et leurs articulations, il doit respecter les règles suivantes :
- chaque nom de service doit être préfixé par le nom (court) de l'application, ex avec le préfix `abes-hello` ceci afin de mieux les distinguer et le regrouper au niveau d'un serveur hébergeant plusieurs applications différentes :
  ```
  services:
    abes-hello-front:
  ```
- chaque service doit nommer son conteneur en réutilisant le même nommage que le service, ex sur `abes-hello` :
  ```
  container_name: abes-hello-front
  ```
- chaque service (sauf rares exceptions) doit se configurer pour redémarrer automatiquement au démarrage de la machine, sauf si l'humain a stoppé intentionnellement le conteneur, cf la directive suivante :
  ```
  restart: unless-stopped
  ```
- chaque service doit limiter sa consommation mémoire et cpu à 5Go et 5 cpu max (sauf rares exceptions) et désactiver la mémoire swap, cf la directive suivante :  
  Dans docker-compose.yml :
  ```
  mem_limit: ${MEM_LIMIT}
  memswap_limit: ${MEM_LIMIT}
  cpus: ${CPU_LIMIT}
  ```  
  Avec dans .env-dist :
  ```
  ######################################################
  # Memory caping for containers : 5Go
  # CPU caping for containers : 5 CPU
  MEM_LIMIT=5g
  CPU_LIMIT=5
  ```


### Configuration d'une application avec docker

Une application qui est déployée en dev, test ou prod sera configurée différement. Des variables permettant de faire varier cette configuration doivent donc être prévues.

Pour chaque application, nous préconisons l'utilisation de variables d'environnement qui utilisent le système du fichier `.env` que docker comprend. Ce fichier contient les variables d'environnement nécessaires aux conteneurs de l'application. Ce fichier est personnalisé manuellement au moment du premier déploiement et dépend de l'environnement de déploiement : dev, test ou prod. Pour créer ce fichier il suffit de faire une copie du fichier .env-dist qui est dans le dépôt `<appli>-docker` de l'application (il contient la liste des variables nécessaires aux conteneurs avec des exemples)

### Choix des ports réseau des conteneurs

Les ports externes utilisés par l'application doivent être contiguës dans une plage de port définie au début du projet (par exemple en réservant 10 ports contiguës) en prenant soin que cette plage de ports n'empiète pas sur d'autres plages de ports utilisées par d'autres applications du SI de l'Abes (l'application interne https://devops.abes.fr/index_ports_containers/ (accès interne Abes) doit être utilisée pour identifier cette plage libre), et que cette plage de ports soit libre sur toutes les machines hébergeant les containers (diplotaxis1, 2, 3, etc.). Cette plage de ports doit être choisie à la suite de la dernière plage de port utilisée par la dernière application ajoutée au SI de l'Abes. Les ports utilisés par une application déployée en dev, test ou prod sont considérés comme occupés, indépendement de l'environnement (par exemple les ports d'une application déployée uniquement en dev sont considérés comme occupés, même si cette dernière n'est pas en prod). Le fichier ``.env-dist`` doit indiquer dans des variables ces ports choisis qui deviennent donc les ports par défaut de l'application mais qui si besoin peuvent être paramétrés du fait qu'il sont variabilisés et pas codés en dur dans le ``docker-compose.yml``.

### Belles URL d'une application & reverse proxy

Un reverse proxy applicatif embarqué dans le ``docker-compose.yml`` est préconisé dans le cas où l'application nécessite une URL pour y accéder. Il est préconisé de baser le reverse proxy applicatif sur une base d'image nginx (serveur web léger et particulièrement adapté pour les reverse proxy). Le nomage du conteneur embarquant le reverse proxy application doit se terminer par "-rp" : ``<appli>-rp``

La mise en place d'une "belle URL" en HTTPS est préconisée pour les applications nécéssitant un accès via le web qu'il soit interne ou public. La "belle URL" est constituée d'un sous-domaine raccrochée à un domaine principal (exemple : https://item.sudoc.fr). Cette "belle URL" est paramétrée au niveau du reverse proxy d'entreprise (raiponce : le même pour toute l'Abes), et il est préconisé de faire pointer cette l'URL vers l'URL interne du reverse proxy applicatif quand il existe (ce qui permet d'avoir un seul mapping) ou, à défaut, vers les différentes URL internes de l'application si cette dernière n'a pas encore de reverse proxy applicatif (cf section "choix des ports réseau des conteneurs").

### Accès au système de fichier par les conteneurs

A rédiger : parler aussi ici des applications qui ont besoin accéder à un disque réseau via un montage NFS, nous privilégions de configurer un volume avec un NFS paramétrable (exemple : ezstats)

### Configuration de logs des conteneurs

Chaque application qui est "dockerisée" et qui produit des logs (c'est-à-dire toutes les applis ?), doit les produire de la même façon et indiquer au démon filebeat comment les récupérer pour qu'il puisse ensuite les envoyer correctement au puits de log (logstash / elasticsearch / kibana).

L'application doit respecter quelques règles :

1) produire ses logs à surveiller sur stdout et stderr
2) paramétrer filebeat avec des labels docker
3) produire ses logs personnalisés en respectant un format

#### Logs docker via stderr et stdout

Pour que le conteneur de l'application produise ses logs sur stdout et stderr, il y a plusieurs possibilités.
- Si c'est une application Java le mieux est d'exécuter le process java en premier plan (foreground). Exemple de point d'entrée docker exécutant l'appli java à partir d'un JAR en premier plan : `ENTRYPOINT ["java","-jar","/app.jar"]`
- Si c'est une script shell (exemple un batch), alors on logguer sur stdout ou stderr au choix en utilisant `>/dev/stdout` (par défaut si rien n'est précisé c'est sur stdout que ça va) ou `>/dev/stderr` pour logguer les erreurs. Exemple :
  ```bash
  echo "INFO: ma ligne de log pour aller sur stdout" >/dev/stdout
  echo "ERROR: ma ligne de log pour aller sur stderr" >/dev/stderr
  ```
- Si c'est une application tierce qu'on ne peut donc pas trop modifier et qui loggue déjà dans un fichier, alors on peut soit configurer l'application pour lui demander de logguer les erreurs sur le fichier `/proc/self/fd/2` (c'est la même chose que le fichier `/dev/stderr`) sur le fichier `/proc/self/fd/1` (ou au choix `/dev/stdout`), soit identifier le chemin du fichier vers lequel l'application va logguer et s'en sortir avec un système de lien symbolique comme par exemple ce que l'image docker officielle de nginx fait : cf son [Dockerfile](https://github.com/nginxinc/docker-nginx/blob/8921999083def7ba43a06fabd5f80e4406651353/mainline/jessie/Dockerfile#L21-L23).

#### Paramètrage pour verser les logs docker dans le puits de log (via filebeat)

Le paramétrage de la remontée des logs dans filebeat (permet le dépot des logs dans le puits de logs de l'Abes) se fait au niveau de chaque conteneur en suivant une nomenclature de "labels docker" (cf [recommandations](https://www.elastic.co/guide/en/beats/filebeat/current/running-on-docker.html#_customize_your_configuration)).

La configuration la plus simple est de seulement signaler à filebeat que les logs du conteneur sont à prendre en compte en n'indiquant aucun format de log. Pour cela il est nécessaire d'ajouter les labels suivant au conteneur. Voici un extrait à copier coller dans un `docker-compose.yml` qui montre comment signaler à filebeat de prendre les logs en compte :
```
    labels:
      - "co.elastic.logs/enabled=true"
      - "co.elastic.logs/processors.add_fields.target="
      - "co.elastic.logs/processors.add_fields.fields.abes_appli=monapplication"
      - "co.elastic.logs/processors.add_fields.fields.abes_middleware=httpd"
```

Les labels ont la signification suivante :
- `co.elastic.logs/enabled=true` : signifie qu'on souhaite que filebeat remonte les logs de ce conteneur (par défault c'est `false`)
- `co.elastic.logs/processors.add_fields.target=` : signifie qu'on souhaite ajouter les deux champs `abes_appli` et `abes_middleware` dans le puits de logs en rateau à la racine des champs (cf [la doc](https://www.elastic.co/guide/en/beats/filebeat/current/add-fields.html#add-fields))
- `co.elastic.logs/processors.add_fields.fields.abes_appli=monapplication` : signifie qu'on souhaite faire remonter un champs personnalisé nommé "abes_appli" qui contiendra comme valeur "monapplication" pour le conteneur présent. Ce champ "abes_appli" est obligatoire, il doit contenir le nom de l'application qui peut elle-même être éclatée en plusieurs conteneurs pour chaque middleware (un pour le web, un pour le back, un pour les batch etc ...), c'est ce champ qui permet de regrouper tous les conteneurs d'une même application au niveau du puits de logs. Remarque : le puits de logs n'accepte pas que le nom de l'application se termine par un chiffre (ex: si l'appli s'appelle "projet2024" ça ne convient pas, il faut que le nom se termine par une lettre, dans notre exemple ça pourrait donner "projetetab"). Remarque : dans une architecture de type orchestrateur (ex: OKD), c'est probablement le nom du pod qui remplacera la valeur de "abes_appli".
- `co.elastic.logs/processors.add_fields.fields.abes_middleware=Httpd` : le champs "abes_middleware" est obligatoire, il permet d'indiquer au puits de logs de l'Abes (via logstash précisément) la nature des logs envoyés et donc dans quel index elasticsearch doit-il classer ces logs. Les valeurs possibles sont : "adhoc", "Httpd" (mettre "adhoc" si ce sont des logs dont le format est spécifique à l'application).

Pour un exemple complet qui montre aussi comment spécifier un format de log précis, on peut se référer à [https://github.com/abes-esr/abes-filebeat-docker/blob/f4b19dfdccab690801c550c61724bd09cbeb6f5b/docker-compose.yml#L24-L37](https://github.com/abes-esr/abes-filebeat-docker/blob/f4b19dfdccab690801c550c61724bd09cbeb6f5b/docker-compose.yml#L24-L37)

On trouve alors d'autres labels dont voici la signification :
- `co.elastic.logs/module=nginx` : signifie qu'on dit à filebeat que ce conteneur produit des logs au format nginx ce qui lui permettra de les envoyer découpés dans le puits de logs (cf la liste des [modules filebeat disponibles](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-modules.html))
- `co.elastic.logs/fileset.stdout=access` : signifie que filebeat doit surveiller les logs stdout du conteneur
- `co.elastic.logs/fileset.stderr=error` : signifie que filebeat doit surveiller les logs stderr du conteneur

La dernière étape pour que les logs remontent jusqu'au puits de logs de l'Abes est de solliciter l'équipe puits de log de l'Abes pour lui demander d'intégrer (configuration à faire au niveau de la brique logstash) les logs de l'application en s'appuyant sur clé `co.elastic.logs/processors.add_fields.fields.abes_appli=monapplication`












## Intégration d’applications en SaaS

Todo à rédiger, parler ici de nos principes et bonnes pratiques génériques pour l’extension et l'intégration des applications en SaaS (exemple : Wordpress)
