
# Architecture d'une application

L’analyse des projets menés à l'Abes a permis de découvrir des structures de projets hétérogènes dépendant de plusieurs facteurs : IDE utilisé, plugins d’IDE, type de projet, expérience personnelle de l'agent dans le développement. Lors d'un transfert de responsabilité d'application vers un autre agent, ou lors de l'intervention d’un développeur sur le code de l’application, il était donc difficile de s'approprier le code en raison de ces aspects hétérogènes.

C'est pourquoi l'utilisation de frameworks spécifiques à chaque type de projet est maintenant préconisée.

Nous pouvons classer nos projets / applications en trois catégories : api, web, et batch

## Application de type API

Depuis le projet d'établissement 2024-2028, nous privilégions la [stratégie "API first"](https://projet2024.abes.fr/docs/2.4/projet2024#24-une-strat%C3%A9gie-dapi) que ce soit pour le système de gestion de métadonnées central de l'Abes ou pour les applications satellites ou autonomes développées par l'Abes.

La technologie préconisée pour implémenter des API dans des applications développées par l'Abes est : Java Spring Boot

### Nommage du github de l'API

les dépôts Github hébergeant les API doivent être nommés en respectant la nomenclature : `<xxx>-api-<typeDeLAPI>`.

Pour choisir `<xxx>`, on garde à l'esprit que :
- le nom du projet ne sera pas obligatoirement le nom de l'application finale
- le nom de domaine en production devra correspondre à `<xxx>`
- les "marques" Abes devront correspondre à `<xxx>`

Pour choisir `<typeDeLApi>`, on précise la finalité de l'API si pertinent.

Ainsi, les API concernant le sudoc seront regroupées par exemple dans un dépôt Github : [https://github.com/abes-esr/sudoc-api/](https://github.com/abes-esr/sudoc-api/)
Les API seront ensuite accessibles via une url comme `https://www.sudoc.fr/services/bestppn`

### Multi-dépôts ou Mono-dépôt pour des API ?

Plusieurs dépôts sont à privilégier lorsque les API d'une même application n'ont que peu de rapport entre elles. Par exemple [https://github.com/abes-esr/theses-api-recherche](https://github.com/abes-esr/theses-api-recherche) contient les API relatives à la recherche dans les métadonnées des thèses tandis que [https://github.com/abes-esr/theses-api-diffusion](https://github.com/abes-esr/theses-api-diffusion) regroupe des services permettant de récupérer les documents thèses.
Un seul dépôt est pertinent lorsque plusieurs API partagent la même thématique. On aura alors un répertoire par API, comme c'est le cas pour [https://github.com/abes-esr/idref-api/](https://github.com/abes-esr/idref-api/) ou [https://github.com/abes-esr/qualinka-microservices/](https://github.com/abes-esr/qualinka-microservices/)

### Versionnage des API

Les API doivent être versionnées en utilisant la notation v1, v2 dans l'url. Ainsi, on peut mettre en ligne une nouvelle version d'une API (/v2) tout en préservant pour un temps donné la version en cours (/v1).
On utilise le versionnage sémantique [https://semver.org/lang/fr/](https://semver.org/lang/fr/) pour gérer les versions de nos applications, les v1, v2 de l'url des API correspondent au premier numéro de la notation sémantique.
On change ce numéro en cas de modification dans les paramètres d'entrée ou de sortie de l'API, ou en cas de changement majeur de comportement susceptible de casser les programmes externes appelant nos API.

### Sécurité des API

* l'authentification (sur LDAP, base de données, service web etc.) et une gestion via l'utilisation de token JWT
* l'autorisation: droits sur les services vérifiés par spring security

Voir aussi la section ci-dessous coucernant la sécurité.

### Documentation des API

La documentation est proposée via OpenAPI. Pour les projets Java Spring, la documentation peut être générée facilement via l'outil SpringDoc:

* ajouter la dépendance dans le pom.xml
* ajouter les annotations sur les méthodes dans les interfaces @ApiOperation(value = "renvoie les demandeModifs pour les administrateurs", notes ="...")
* ajouter une classe OpenApiConfig

La documentation produite doit suivre les recommandations de la DINUM pour le partage des données par API dans l'administration : [https://www.numerique.gouv.fr/publications/recommandations-partage-donnees-api/](https://www.numerique.gouv.fr/publications/recommandations-partage-donnees-api/)

### Déploiement des API

Le choix d'un unique ou de plusieurs containers Docker pour déployer les API se fait en fonction de l'architecture choisie.
Si on met en oeuvre une architecture Java "traditionnelle", on peut soit déployer l'API dans un seul container, soit avoir un container par API. Dans le cas d'une architecture microservice, on aura un container par service ainsi que pour les éléments du système comme le registry par exemple.

## Application de type web

Nous privilégions une architecture avec un fort découplage entre client et serveur : ceci permet une meilleure expérience utilisateur (le client s'exécute dans le navigateur) et donne la possibilité d'ajouter ou de remplacer facilement le client.

La partie serveur se traduit par une API qui est un ensemble de services web accessibles, versionnés et documentés (voir la section ci-dessus).

Pour développer la partie cliente, nous avons choisi d'utiliser le [framework VueJs](https://vuejs.org/).

## Application de type batch

Ces applications permettent de réaliser des tâches côté serveur sans IHM.
L'utilisation du framework [Java Spring Batch](https://spring.io/projects/spring-batch) est notre choix.








