# Gestion du code source

Pour gérer nos codes sources, nous utilisons majoritairement [Github](https://github.com/abes-esr) comme gestionnaire de code open source (ou SCM pour source control management) associé à notre plateforme d'intégration continue (cf partie ci/cd).

## Licence

Tous les nouveaux projets créés par l'Abes depuis 2019 produisent du code opensource.

Nous appliquons la [Licence CeCILL](https://fr.wikipedia.org/wiki/Licence_CeCILL) : c'est une licence équivalente à la GPL compatible avec le droit Français et [préconisée par la loi pour une République numérique](https://www.data.gouv.fr/fr/licences). Elle est donc "contaminante", c'est à dire qu'elle impose aux contributeurs de publier les modifications/améliorations réalisées sous la même licence. Cette licence est [positionnée dans l'application Hello Abes ici](https://github.com/abes-esr/abes-hello-front/blob/develop/LICENSE) et peut être prise comme exemple pour les nouvelles applications.  

Les [bibliothèques de logiciels](https://fr.wikipedia.org/wiki/Biblioth%C3%A8que_logicielle) ("librairies") développées sont elles publiées sous la [licence MIT](https://fr.wikipedia.org/wiki/Licence_MIT) qui permet une réutilisation moins contraignante et donc plus adapté à la nature de ces  codes.
## Forge logicielle : github


Github et Gitlab fournissent une interface web qui :
* donne accès aux fichiers, aux commits, à un moteur de recherche sur le code source
* propose un éditeur de code en ligne
* permet de suivre facilement les modifications apportées par les développeurs
* permet de visualiser l'activité de chaque développeur.
* donne accès un tableau de type Kanban qui nous permet de gérer les sprints lorsque le projet est mené en méthode agile. Un atout de ce tableau est de pouvoir lier les tâches aux commits.

Pour tous les développements réalisés par l'Abes depuis 2019, c'est Github qui est utilisé pour permettre la publication en open source. Le GitLab interne de l'Abes n'est plus utilisé pour les nouveaux développements.

## Numéros de version : semver


Le projet est une succession d’itérations : demande de fonctionnalités, implémentation, correction des bugs etc. Ces évolutions sont reflétées par les numéros de version des projets.

Nous utilisons la notation `X.Y.Z`, préconisée par le semantic versioning : https://semver.org/spec/v2.0.0.html

- `X` correspond à une version majeure du système. Cette mise à jour peut potentiellement provoquer des incompatibilités par rapport aux versions précédentes.
- `Y` correspond à une version mineure, ce numéro est incrémenté lors d'ajouts de fonctionnalités.
- `Z` est le numéro du build, il est incrémenté par exemple lors de la correction d'un ensemble de bugs ou de la factorisation d'une partie du projet.


Enfin, nous distinguons les release et les snapshot. Pour les snapshot, les numéros de version sont suffixés par `-SNAPSHOT`. Rien n'est ajouté au numéro pour les releases. Un snapshot est la version en cours de développement (branche git `develop`).

Une release correspond à l'état stable d’une version. Si par exemple la construction de la `2.0.6` est lancée en release, le numéro de version pour le snapshot suivant est incrémenté et devient `3.0.0` ou `2.1.0` ou `2.0.7`. Ce fonctionnement est automatisé pour Java via l'utilisation de Maven et pour VueJS via l'utilisation de Npm.

A chaque release correspondant le tag Git ayant la même valeur `X.Y.Z` posé sur la branche `main` du code source.

## Utilisation des branches : gitflow

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

## Publier une nouvelle release d'une application


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

## Messages de commit


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
```
NumeroISSUE Type : Message du commit
Court paragraphe décrivant les modifications plus en détail si nécessaire
```

## Création et configuration d'un nouveau dépôt


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

## Codes partiellement ouverts sur Github

Les dépôts Github publiés par l'Abes qui contiennent du code qui dépend de librairies non opensource (car pas encore libérées par l'Abes) doivent le mentionner dans le `README.md` du dépot par la mention suivante :
> Attention : ce code (open)source, développé et maintenu par l'Abes ne peut pas (encore) être réutilisé à l'exterieur car il dépend de librairies internes. Contactez nous (github@abes.fr) si vous souhaitez y contribuer.

Ainsi les collègues contributeurs externes à l'Abes sont prévenus rapidement et cela leur évite de perdre du temps à essayer de compiler/réutiliser le code.
## Codes ESR ouverts et partagés sur Github

Le github https://github.com/abes-esr/ regroupe également les codes sources des applications développées par les établissements des réseaux de l'Abes qui souhaitent les partager au niveau national à tout l'ESR (cf [présentation ici](https://punktokomo.abes.fr/2019/06/18/une-politique-informatique-ouverte-pour-labes/)).

A noter que l'Abes n'impose pas aux établissements de respecter la politique de développement de l'Abes pour ne pas imposer des contraintes trop fortes. En revanche l'Abes demande de respecter quelques règles :
- des règles de nommage du dépôt et la présence d'un README même minimaliste décrivant le contenu du dépôt (cf [cette section](https://politique-developpement.abes.fr/docs/Architecture%20des%20projets#nom-dun-projetapplication) et [cette section](https://politique-developpement.abes.fr/docs/Gestion%20du%20code%20source#cr%C3%A9ation-et-configuration-dun-nouveau-d%C3%A9p%C3%B4t))
- une licence open source (l'établissement peut si besoin s'inspirer des [choix de l'Abes](https://politique-developpement.abes.fr/docs/Gestion%20du%20code%20source#licences))

En option, l'Abes propose aux établissements un espace pour communiquer sur leur code source/application dans le [blog technique de l'Abes](https://punktokomo.abes.fr/) via un article (voici un [exemple](https://punktokomo.abes.fr/2019/10/08/sudoctoolkit-une-application-pour-faciliter-lutilisation-des-web-services-de-labes/))

Pour faire une demande de dépôt de code source dans le github de l'Abes, les établissements sont invités à utiliser le guichet d'assistance de l'Abes : https://stp.abes.fr




