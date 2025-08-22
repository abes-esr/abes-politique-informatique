# Outils pour les développements

Un Environnement de Développement Intégré permet de manipuler des outils de programmation depuis une interface graphique, il doit assister les développeurs dans toutes les phases de la réalisation d’une application : définition, conception, programmation, débogage, compilation, test, maintenance et production de documentation. Il doit également orienter le développeur vers de bonnes pratiques.

## Java

Pendant longtemps, les développeurs de l'Abes ont utilisé les IDEs Eclipse et Netbeans. Il s'est avéré que pour faciliter l'entraide, il était préférable que nous utilisions tous le même IDE. Ceci permet de fortement capitaliser sur son fonctionnement, de le prendre en main et de maîtriser sa configuration.

Jusqu'en 2018, notre choix s'était porté sur l'éditeur Eclipse.
Nous packagions l'IDE en pré-configurant les modules et plug-ins conformément aux préconisations de notre politique de développement (sonarlint etc.)

Nous avons testé l'éditeur en ligne Eclipse Che.
Eclipse Che est une solution prometteuse mais pas encore mûre. L’IDE est dans le cloud où l’environnement d’exécution est embarqué dans l’espace de travail du développeur. L’environnement de travail du développeur est donc stocké sur un serveur dans un container Docker.
Une  version béta a été lancée en juillet 2016. Nous avions mis cette solution de côté tout en suivant son développement. En effet, Eclipse Che n'est pas aussi complet qu'un éditeur client lourd.

Depuis 2018, nous utilisons désormais Intellij IDEA qui nous parait être l'éditeur le plus performant.

Le démarrage rapide pour travailler sur un projet consiste à:
* faire un clone du projet depuis Gitlab ou Github
* choisir le SDK approprié (dans les project settings, project, project SDK)

## Javascript

Le code VusJs et plus généralement Javascript peut être édité via Intellij. Nous utilisons également Webstorm et VSCode.

## PL/SQL

SQL Developer reste l'éditeur favori en ce qui concerne l'édition de code PL/SQL. Le versionning de PL/SQL n'est pas contre pas géré en natif que ce soit dans la base de données Oracle ou via SQL Developer. Pour versionner le code, nous mettons en oeuvre deux solutions suivant les applications : soit un batch récupère les procédures stockées, fonctions, etc. et les versionne dans le Gitlab interne régulièrement, soit les codes PL/SQL sont copiés dans un répertoire "sql" de l'application et sont versionnés au plus près du code de l'application.

