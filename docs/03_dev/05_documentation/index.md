# Urbanisation et documentation

La documentation d’un logiciel est indispensable car elle permet de :

* donner une vue d'ensemble de l'intérêt et de l'usage d’un logiciel
* reprendre plus aisément le code développé par un autre programmeur
* retrouver plus facilement comment le logiciel a été structuré
* partager le logiciel avec d’autres programmeurs : ce point est essentiel lors de la publication d’une API

On distingue trois types de documentation :

* __La documentation à l’usage des utilisateurs__
* __La documentation à l'usage des développeurs__
* __La documentation à l'usage des administrateurs__

## Documentation utilisateur

Elle explique comment prendre en main l'application. On y retrouve la description des fonctionnalités, des interfaces... exemple : http://documentation.abes.fr/aidestar/accueil/

Les nouvelles applications développées à l'Abes privilégient une architecture qui sépare la partie interface utilisateur de la partie serveur qui peut être interrogée indépendamment. Cette partie serveur API est documentée au format openAPI qui décrit chaque service. Cette documentation s'adresse donc plutôt aux développeurs qui veulent utiliser l'API.

https://swagger.io/docs/specification/about/ décrit la spécification openAPI. Des outils permettent de générer automatiquement du code client à partir de cette description. Elle est accessible sous format brut (ex : https://item.sudoc.fr/api/v2/api-docs) ou via une présentation en html.

## Documentation développeur

La documentation développeur des outils et applications de l'Abes est déposée au plus près du code source.

Il ne s’agit pas de décrire de manière exhaustive et systématique chaque détail de l'application, mais plutôt de __donner une vue d'ensemble, de décrire les éléments indispensables à la compréhension de la structure de l’application__. Nous pouvons éventuellement utiliser le formalisme UML et ses principaux type de diagrammes. Les diagrammes UML peuvent être générés avec différents éditeurs, par exemple http://www.umlet.com.

* le diagramme de classes donne une vue statique des éléments
* le diagramme de séquence montre les interactions entre les objets
* le diagramme de déploiement situe l’application dans son contexte
* un diagramme des flux entrants et sortants permet de décrire la communication et les dépendances de l’application

Cette documentation doit être rédigée en adoptant le point de vue d'un(e) nouveau(velle) développeur(se) à qui l'on veut fournir le niveau d'information minimal essentiel pour lui permettre d'aborder le projet.

Ces informations liées à la structure de l'application doivent être consignées dans un fichier `README-dev.md` présent à la racine du dépôt.

Exemple : https://github.com/abes-esr/item-api/blob/develop/README-dev.md

Il faut aussi renseigner les informations jugées utiles pour faciliter la prise en main de l'application par un nouveau développeur :

* l’adresse du dépôt Github ou Gitlab
* les éléments de configuration
* les projets associés à l'application

Ces méta-informations doivent être consignées dans un fichier `README.md` présent à la racine du dépôt.

Des fichiers `README-xxx.md` supplémentaires peuvent être ajoutés si nécessaire, par exemple un `README-faq.md` peut recenser les questions relatives à l'application.


Enfin, la documentation dans le code est également nécessaire pour expliquer des parties complexes. Nous utilisons les conventions Javadoc pour documenter le code Java. Les blocs sont rédigés et ajoutés en en-tête des classes et méthodes de l’application. Il faut décrire ce que fait la méthode et pourquoi elle doit le faire (le contexte), quels sont les paramètres en entrée et en sortie et quelles erreurs sont susceptibles d'être renvoyées.  
Il faut aussi ajouter des commentaires dans le code lui-même lorsqu'ils sont nécessaires à sa compréhension. Les commentaires doivent être écrits pour décrire ce que fait le code et surtout pour comprendre pourquoi il fait telle ou telle chose.


## Documentation administrateur : fiche d'exploitation

Tous les outils et applications de l'Abes possédent une fiche d'exploitation. Cette fiche d'exploitation se formalise sous la forme d'un `README.md` dans le dépôt qui contient la configuration pour son déploiement (`<appli>-docker`). La fiche d'exploitation doit respecter un modèle pour être certain de ne pas oublier des informations importantes comme par exemple : installer l'application, démarrer/stopper l'application, sauvegarder l'application, restaurer l'applicaiton. Le modèle à respecter est disponible sur le dépôt de l'application exemple hello-abes ici : https://github.com/abes-esr/abes-hello-docker/blob/develop/README.md

Pour certaines applications, des tâches de maintenance doivent être réalisées régulièrement (mise à jour de données par exemple). L'exécution de ces tâches peut prendre la forme de lancement de traitements via une interface utilisateur ou via des outils accessibles en lignes de commande. Des procédures permettant de réaliser cela doivent être décrites dans la fiche d'exploitation.

Exemple de fiche d'exploitation : https://github.com/abes-esr/qualimarc-docker?tab=readme-ov-file#qualimarc-docker

## Release note

Les release note d'un outil ou application doivent être indiquées dans la documentation utilisateur de l'application.

Exemple : https://documentation.abes.fr/aidequalimarc/index.html#VersionsLogicielles


## Cartographie et processus métiers

Tous les outils et applications de l'Abes qui sont en production doivent être cartographiées (via l'outil [Archi](https://www.archimatetool.com/)) dans https://urbanisation.abes.fr (accès interne Abes)

Parfois les évolutions des outils et applications de l'Abes peuvent nécessiter une analyse avancée des processus métiers pour aider l'équipe projet à comprendre le fonctionnement d'une application. Des processus métiers en BPMN (via l'outil [Bizagi](https://www.bizagi.com/)) peuvent donc être réalisés à la demande mais ne sont pas systématisés car leur création est très consommatrice en temps. Les BPMN sont stockées sur https://urbanisation.abes.fr/bpmn/ (accès interne Abes)

 
