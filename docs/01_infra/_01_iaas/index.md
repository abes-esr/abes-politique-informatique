# La plateforme IaaS


## Environnements de développement, test et production

### Types d'environnement
Nous déployons nos applications sur trois types d’environnements :
* __Développement__ (appelé aussi "dev")  
  Les développeurs testent le code qu'ils produisent en local sur leur machine. On dispose également d'un environnement de développement, c'est à dire un environnement partagé qui permet de réaliser les tests techniques du programme dans un environnement proche de la production (même version de Linux etc.). Cet environnement peut également servir à tester les montée de version des composants de l'application (container tomcat etc.). Il est accessible en interne.
  Les développeurs utilisent cet environnement pour tester les modifications réalisées sur les programmes sans gêner les tests fonctionnels.
* __Test__
  Les serveurs de test permettent aux utilisateurs de tester une version de l’application dans un environnement parfaitement similaire à l’environnement de production.
  A l’extérieur de l’Abes, les serveurs de tests sont accessibles uniquement aux établissements du réseau RENATER.

* __Production__ (appelé aussi "prod")  
  Ce sont les environnements qui hébergent la version officielle de l’application.

* Le cas échéant, un environnement de préproduction peut être nécessaire. On pense par exemple au déploiement d'une correction de bug sur la production.

### Architecture des environnements

Chaque environnement est cloisonné. On ne peut pas accéder depuis un type d’environnement à un autre. Il n’y a par contre pas de cloisonnement par application.

Les points de montage qui permettent d’accéder aux espaces de stockage réseaux sont tous nommés : /applis/ que l’on soit sur l’environnement de développement, de test ou de production, ceci pour faciliter le déplacement des applications d’un environnement à l’autre (inutile de modifier les fichiers de configuration).

Si l’application a besoin de connaitre l’environnement sur lequel elle s’exécute, elle peut interroger une variable d’environnement positionnée sur chaque type d’environnement : `APPLIS_ENV`. Cette variable peut prendre comme valeur DEV, TEST ou PROD. On peut la récupérer en java via l’instruction System.getenv().

Remarque pour les batch : la variable d'environnement `APPLIS_ENV` n'est pas automatiquement injectée lorsque le batch est exécuté par crontab. Si l'on souhaite pouvoir l'utiliser dans ce contexte, veillez à sourcer le fichier `/etc/profile` (c'est ici que `APPLIS_ENV` est positionnée) avant de lancer le batch. Exemple :
```cron
* * * * * source /etc/profile ; /home/batch/monbatch.sh
```

Dans chaque type d’environnement, on peut trouver des serveurs d’application, des serveurs d’indexation, des serveurs de base de données. L’existence de chacun de ces serveurs n’est pas systématique et reste relative à chaque application. Chaque application doit être accompagnée de sa documentation explicitant sa propre architecture : elle doit préciser le type de serveurs mis en œuvre, la version des composants logiciels.

### Maintenance technique et configuration
Concernant la mise à jour des composants logiciels, la procédure est la suivante : à un instant t, les environnements de développement, test et production ont les mêmes versions de middleware (Centos, Tomcat, JDK, etc.) Si une mise à jour est nécessaire, elle est faite pour le composant donné sur l’environnement de test. Les problèmes techniques résultant de la migration doivent être résolus sur l’environnement de test. Lorsque les tests fonctionnels passent, on peut réaliser la migration en production et en développement.

Les déploiements sur ces environnements sont automatisés via des jobs Jenkins qui lancent les scripts Puppet. Ils sont activés par les développeurs. Les déploiements ne doivent pas être réalisés via le manager Tomcat (il peut en effet manquer des étapes, par exemple la copie de fichiers de configuration).
Les déploiements sur l'environnement de production sont activés par le responsable d’application ou par le SIRE.
