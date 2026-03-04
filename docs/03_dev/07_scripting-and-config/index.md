# Scripting et paramétrage avancé

Cette politique établit un cadre de gestion des activités de scripting et de paramétrage à l'Abes. L'enjeu est double, il s’agit d’une part de déterminer la portée de l'usage de ces activités afin de garantir la maîtrise des risques et la pérennité du système d'information, et d’autre part de définir un cadre de collaboration entre collègues permettant de réaliser ces activités de manière efficace.



## Définition des tâches et des responsabilités

Ces tâches de scripting et de paramétrage avancé peuvent être réalisées dans deux contextes différents impliquant des responsabilités différentes : celui d’un usage individuel et ponctuel qui n’a pas d’impact sur la continuité de l’offre de service de l’Abes, et celui d’un usage en production critique qui permet d’assurer la continuité de l’offre de service de l’Abes.  
Enfin, une même tâche peut être implémentée de différentes manières par un script ou un paramétrage avancé. Il est important de dissocier la fonction réalisée par une tâche de son implémentation car cette distinction permet de passer de la responsabilité individuelle à la responsabilité institutionnelle d’un script ou d’un paramétrage avancé.


### Usage individuel et ponctuel (responsabilité de l'agent)

L'usage est considéré comme individuel lorsque l'impact d'une erreur ou d'une interruption est limité au travail propre de l'agent. Ces tâches sont généralement exécutées sur le PC de l'agent, sur un outil mutualisé, ou sur l'infrastructure de test de l'Abes.

- **Scripts sur poste de travail (tâche ponctuelle)** : il s'agit de scripts développés pour une tâche spécifique et non récurrente, comme un script Python pour reformater des données dans un KBART afin de vérifier une hypothèse, un script bash pour simuler une montée en charge ou un script pour faire une analyse (exemple : analyse statistique de données pour déterminer le périmètre d'une API et cerner les cas limites). Ces tâches sont généralement exécutées sur le PC de l'agent, sauf si elles sont très gourmandes en temps, auquel cas l'infrastructure de dev ou test de l'Abes peut être utilisée (en coordination avec les services responsables).

- **Paramétrage avancé dans des applications et outils (tâche ponctuelle)** : il s’agit de modifications de fichiers de paramétrage, de configuration ou d’options avancées dans un outil. Tout comme pour les scripts sur poste de travail, ces paramétrages avancés ont vocation d’aider à l’analyse, à vérifier des hypothèses et à tester des idées. La diversité de ces paramétrages est large, elle peut aller du développement d’une XSLT pour tester un reformatage de données (ex : Unimarc vers Marc21), ou la réalisation de simili-scripts (GREL ou Jython) dans OpenRefine pour analyser un jeu de données adhoc, ou encore le paramétrage d’un module dans un ETL pour tester la faisabilité d’un traitement de données.


### Usage institutionnel et critique (responsabilité de l'organisation)

Dès qu'une tâche sert à autrui ou devient structurelle, elle devient un bien institutionnel et doit respecter la politique informatique de l’établissement. Ces tâches sont exécutées sur l'infrastructure informatique de dev, de test puis de production de l'Abes et respectent les règles de la politique informatique d’une application en production.

- **Scripts en production (tâche récurrente)** : souvent appelés "batchs", ces scripts s'exécutent de manière récurrente sur un serveur et sont intégrés au processus de maintenance du SI de l’Abes. Ils peuvent être utilisés, par exemple, pour synchroniser des applications comme STAR et theses.fr toutes les minutes, pour traiter des logs avec ezpaarse ou pour sauvegarder des bases de données. Le script en production implémente alors une fonction et cette même fonction peut avoir été préparée préalablement via un script sur poste de travail. A noter : il peut être nécessaire de réécrire un script pour que sa fonction soit intégrée au système d’information. (cf section « De l'expérimentation à l'industrialisation de la fonction »)

- **Paramétrage avancé en production (tâche récurrente)** : de la même manière que pour les scripts en productions, un paramétrage avancé en production doit respecter les processus de maintenance du SI de l’Abes. A noter que les paramétrages avancés sont censés être, par nature, prêts pour la production du fait du cadre imposé par l’application / outil donnant lieu à ce paramétrage. Mais le cadre imposé par l’application / outil peut être parfois trop léger et générer de fait des dérives susceptibles d’induire des difficultés de maintenabilité (cf section « De l'expérimentation à l'industrialisation de la fonction »).




## Cadre de travail collaboratif

La collaboration entre bibliothécaires et informaticiens est encouragée pour garantir la qualité et l'efficacité, selon les conditions suivantes :
- **Compétences partagées** : le bibliothécaire apporte la connaissance métier et des notions de scripting, tandis que l'informaticien garantit la robustesse technique.
- **Objectif d'efficience** : la réalisation se fait en étroite association entre informaticien et bibliothécaire et la complexité de réalisation doit rester faible (idéalement < 1 journée de travail) pour limiter les problèmes de maintenance.
- **Autonomie documentée** : un bibliothécaire peut agir en autonomie s’il est formé et que le paramétrage ou le script est déjà existant et documenté par une procédure.




## De l'expérimentation à l'industrialisation de la fonction

Il est essentiel de comprendre que l'on n'industrialise pas le script lui-même, mais la fonction qu'il remplit. Si un script ad hoc s'avère indispensable à l'Abes, la fonction métier qu'il assure doit être redéveloppée selon les standards professionnels et respecter la politique informatique (tests, documentation, sécurité).

Signaux d'alerte pour le passage à l'industrialisation :

- **Récurrence et automatisation** : Plus la fréquence d’utilisation d'un script ou paramétrage est élevée, plus il est important de l'automatiser et de l'intégrer au SI pour limiter la consommation de ressources humaines. Un script ou paramétrage qui est répétée plus de 6 fois par an doit être intégrée au SI et suivre le circuit de maintenance et de projet de l'Abes.
  - Question clé : _Ai-je besoin de lancer mon script plus de 2 fois par an ?_

- **Passage à l'échelle** : Un script ou paramétrage initialement défini pour des besoins individuels qui se met à fournir un service interne ou externe avec des attendus sur la disponibilité de ce service, doit être industrialisé et donc intégré au SI et suivre le circuit de maintenance et de projet de l'Abes.
  - Question clé : _Mon script sert-il à d’autres que moi ?_

- **Complexité grandissante** : Un script ou paramétrage qui, de simple et facile à maintenir, devient complexe et difficile à maintenir au fil des usages, signale également un besoin de simplification et d'intégration au SI. Un script qu'on ne sait plus facilement faire évoluer pour intégrer une évolution demandée doit lever une alerte. Des [bonnes pratiques](https://politique-informatique.abes.fr/docs/dev/development/code-quality/#bonnes-pratiques-de-programmation) peuvent être adoptées pour limiter cette complexité.
  - Question clé : _Si j’ai besoin de le faire évoluer, suis-je capable de savoir en moins de 30 mn où intervenir dans mon script ?_

- **Risque d'éparpillement** : L'utilisation de langages non référencés dans la politique informatique doit être un signal d'alerte, car cela peut entraîner une dispersion des compétences et un manque de support dans le cas où ce script ou paramétrage viendrait à être intégré au SI. 
  - Question clé : _Le collègue informaticien avec qui j’ai travaillé avait-il connaissance de ce langage de programmation ? Ai-je déjà discuté de maintenabilité du code avec lui et si oui a-t-il émis des recommandations ?_


