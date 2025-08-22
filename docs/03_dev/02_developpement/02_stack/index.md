
# Stack technique

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
## Framework Spring pour les applications serveurs (Java)

Le framework qui s'est imposé ces dix dernières années dans le monde Java est Spring. Il est très largement utilisé dans le monde Java, ce qui en fait un standard de fait et constitue une certaine garantie sur la pérennité du framework. Spring propose une très bonne intégration avec d'autres frameworks open source comme Hibernate ou des standards de Java (Servlets, JMS, JDO etc.) Toutes les fonctionnalités de Spring peuvent s'utiliser dans un serveur Java EE et pour la plupart dans un simple conteneur web ou une application standalone.

Les fonctionnalités offertes par Spring sont très nombreuses et les sujets couverts ne cessent d'augmenter au fur et mesure des nouvelles versions et des nouveaux projets ajoutés au portfolio.

La documentation de Spring est complète et régulièrement mise à jour lors de la diffusion de chaque nouvelle version. La mise en oeuvre de Spring n'est pas toujours aisée, car il existe généralement plusieurs solutions pour implémenter une fonctionnalité. Nous essayons autant que possible de réutiliser des architectures validées dans nos différents projets.

A noter qu'il n'est pas rare que les livrables aient une taille importante du fait des nombreuses librairies requises par Spring et ses dépendances.
## Framework VueJs pour les applications clientes (CSS/Javascript)

Les frameworks Javascript permettent de construire des applications s'exécutant essentiellement dans le navigateur web en minimisant les échanges avec la partie serveur. Ce fonctionnement permet d'obtenir une expérience utilisateur plus fluide et riche. Côté développeur, ces frameworks ajoutent une couche d'abstraction qui manquait dans l'univers Javascript.
Actuellement les frameworks Javascript les plus populaires sont React, Angular et VueJs.  
Nous avons fait le choix de VueJs pour sa légèreté et facilité à prendre à main. Nous utilisons également Vuetify qui propose une galerie de composants graphiques.
Ce framework implémente le modèle MVVM (modèle-vue-vue-modèle) via un système de binding qui permet d'échanger instantanément des données entre le modèle et la vue.
### Technique du "cache busting" pour les applications clients pas encore en VueJS

Il est préconisé de mettre en place la technique du [cache busting](https://www.keycdn.com/support/what-is-cache-busting) pour les applications HTML/CSS/JS qui n'utilisent pas encore VueJS. Cette technique permet de palier les problèmes de mise en cache des "vieilles" ressources statiques (CSS/JS) lorsque l'on publie une nouvelle version de l'application (et évite par exemple de demander aux utilisateurs de faire CTRL+F5 pour avoir la bonne version des ressources). Cette technique consiste à ajouter le numéro de version ou le hash du dernier commit dans l'URL de la CSS/JS au moment de l'inclusion ou bien d'y indiquer une valeur arbitraire qui est modifiée au moment où la ressource statique CSS/JS a été modifiée.

Voici un exemple sur IdRef avant la mise en place du cache busting :
```html
<link rel="stylesheet" type="text/css" href="css/style.css" title="style" media="screen"/>
```

Et voici ce que cela donne après la mise en place du cache busting :
```html
<link rel="stylesheet" type="text/css" href="css/style.css?v1" title="style" media="screen"/>
```

