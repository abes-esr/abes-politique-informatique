# Nommage d'une application

Un projet dont l'objectif est de créer ou de faire évoluer une application donnera forcément lieu tôt ou tard au choix d'un nom d'application.
Généralement le nom d'un projet réutilise le nom de l'application mais ce sont deux notions distinctes (un projet désigne l'organisation et les moyens pour créer ou faire évoluer une application, tandis qu'une application c'est le résultat d'un projet, c'est un produit logiciel qui tourne et que des utilisateurs utilisent).

Au niveau technique il est convenu de choisir un nom d'application respectant les règles suivantes :
* réutiliser le nom public de l'application (exemple : on choisirait "qualimarc" et pas "outil-qualite-sudoc" car c'est comme ça qu'il est connu par le public)
* ne pas utiliser de majuscules
* si plusieurs mots sont nécessaire, les séparer avec des tirets "-" (tiret du 6)
* ne pas terminer par un chiffre (c'est une contrainte du puits de log de l'Abes qui n'accepte pas que le nom de l'application se termine par un chiffre, par exemple privilégier "projet-etab" plutôt que "projet2024")

Ce nom sera ensuite utilisé dans le nom des dépôts github, dans le code source et sa documentation, dans les images et les conteneurs docker, dans les tests, dans les scripts de déploiement, dans le nom de domaine du site web. Si ce nom change, il devient alors nécessaire de modifier l'ensemble de la chaine technique.  
Attention cette opération est couteuse d'où l'importance choisir un nom stable le plus en amont possible du projet.




