# Urbanisation et documentation

## Fiche d'exploitation

Tous les outils et applications de l'Abes possédent une fiche d'exploitation. Cette fiche d'exploitation se formalise sous la forme d'un `README.md` dans le dépôt qui contient la configuration pour son déploiement (`<appli>-docker`). La fiche d'exploitation doit respecter un modèle pour être certain de ne pas oublier des informations importantes comme par exemple : installer l'application, démarrer/stopper l'application, sauvegarder l'application, restaurer l'applicaiton. Le modèle à respecter est disponible sur le dépôt de l'application exemple hello-abes ici : https://github.com/abes-esr/abes-hello-docker/blob/develop/README.md

Exemple de fiche d'exploitation : https://github.com/abes-esr/qualimarc-docker?tab=readme-ov-file#qualimarc-docker
## Release note

Les release note d'un outil ou application doivent être indiquées dans la documentation utilisateur de l'application.

Exemple : https://documentation.abes.fr/aidequalimarc/index.html#VersionsLogicielles

## Documentation développeur

La documentation développeur des outils et applications de l'Abes est déposée au plus près du code source. Elle est déposée dans le dépôt github dans un README dédié.

Exemple : https://github.com/abes-esr/item-api/blob/develop/readme-developpement.md

## Cartographie et processus métiers

Tous les outil et applications de l'Abes qui sont en production doivent être cartographiées (via l'outil [Archi](https://www.archimatetool.com/)) dans https://urbanisation.abes.fr (accès interne Abes)

Parfois les évolutions des outils et applications de l'Abes peuvent nécessiter une analyse avancée des processus métiers pour aider l'équipe projet à comprendre le fonctionnement d'une application. Des processus métiers en BPMN (via l'outil [Bizagi](https://www.bizagi.com/)) peuvent donc être réalisés à la demande mais ne sont pas systématisés car leur création est très consomatrice en temps. Les BPMN sont stockées sur https://urbanisation.abes.fr/bpmn/ (accès interne Abes)

 
