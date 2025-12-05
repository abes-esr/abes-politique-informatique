# Normes de codage


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

## SonarQube

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


## Bonnes pratiques de programmation

En termes de programmation, nous cherchons à privilégier :

* la programmation avec des interfaces et non des implémentations
* l'inversion de contrôle pour réduire le couplage entre classes
* l'utilisation des design patterns reconnus (tout en prenant soin d'éviter l'écueil de la sur-utilisation)
* les principes [KISS](https://fr.wikipedia.org/wiki/Principe_KISS), [YAGNI](https://fr.wikipedia.org/wiki/YAGNI) et [DRY](https://fr.wikipedia.org/wiki/Ne_vous_r%C3%A9p%C3%A9tez_pas) 
* des commentaires décrivant le pourquoi et/ou le comment de parties de code non évidentes



