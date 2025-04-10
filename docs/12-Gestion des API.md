# Gestion des API

## Dépôts Github

### Nommage

les dépôts Github hébergeant les API doivent être nommés en respectant la nomenclature : `<xxx>-api-<typeDeLAPI>`.

Pour choisir `<xxx>`, on garde à l'esprit que :
- le nom du projet ne sera pas obligatoirement le nom de l'application finale
- le nom de domaine en production devra correspondre à `<xxx>`
- les "marques" Abes devront correspondre à `<xxx>`

Pour choisir `<typeDeLApi>`, on précise la finalité de l'API si pertinent.

Ainsi, les API concernant le sudoc seront regroupées par exemple dans un dépôt Github : [https://github.com/abes-esr/sudoc-api/](https://github.com/abes-esr/sudoc-api/)
Les API seront ensuite accessibles via une url comme `https://www.sudoc.fr/services/bestppn`

### Multi-dépôts ou Mono-dépôt?

Plusieurs dépôts sont à privilégier lorsque les API d'une même application n'ont que peu de rapport entre elles. Par exemple [https://github.com/abes-esr/theses-api-recherche](https://github.com/abes-esr/theses-api-recherche) contient les API relatives à la recherche dans les métadonnées des thèses tandis que [https://github.com/abes-esr/theses-api-diffusion](https://github.com/abes-esr/theses-api-diffusion) regroupe des services permettant de récupérer les documents thèses.
Un seul dépôt est pertinent lorsque plusieurs API partagent la même thématique. On aura alors un répertoire par API, comme c'est le cas pour [https://github.com/abes-esr/idref-api/](https://github.com/abes-esr/idref-api/) ou [https://github.com/abes-esr/qualinka-microservices/](https://github.com/abes-esr/qualinka-microservices/)

## Versionnage

Les API doivent être versionnées en utilisant la notation v1, v2 dans l'url. Ainsi, on peut mettre en ligne une nouvelle version d'une API (/v2) tout en préservant pour un temps donné la version en cours (/v1).
On utilise le versionnage sémantique [https://semver.org/lang/fr/](https://semver.org/lang/fr/) pour gérer les versions de nos applications, les v1, v2 de l'url des API correspondent au premier numéro de la notation sémantique.
On change ce numéro en cas de modification dans les paramètres d'entrée ou de sortie de l'API, ou en cas de changement majeur de comportement susceptible de casser les programmes externes appelant nos API.

## Documentation

La documentation est proposée via OpenAPI. Pour les projets Java Spring, la documentation peut être générée facilement via l'outil SpringFox:

* ajouter la dépendance dans le pom.xml
* ajouter les annotations sur les méthodes dans les interfaces @ApiOperation(value = "renvoie les demandeModifs pour les administrateurs", notes ="...")
* ajouter une classe SwaggerConfig

La documentation produite doit suivre les recommandations de la DINUM pour le partage des données par API dans l'administration : [https://www.numerique.gouv.fr/publications/recommandations-partage-donnees-api/](https://www.numerique.gouv.fr/publications/recommandations-partage-donnees-api/)

## Déploiement

Le choix d'un unique ou de plusieurs containers Docker pour déployer les API se fait en fonction de l'architecture choisie.
Si on met en oeuvre une architecture Java "traditionnelle", on peut soit déployer l'API dans un seul container, soit avoir un container par API. Dans le cas d'une architecture microservice, on aura un container par service ainsi que pour les éléments du système comme le registry par exemple.
  
