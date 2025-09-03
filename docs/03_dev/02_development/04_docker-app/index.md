# Applications dockerisées

## Structure d’une application dockerisée

Une application dockerisée respecte plusieurs règles :
- l'application possède un dépôt pour son code source et c'est ce même dépôt qui est chargé de générer et de publier son image docker.
  - ce dépôt contient le `Dockerfile` de l'application dont l'objectif est de produire l'image docker de l'application pour qu'elle soit ensuite prête à être exécutée (ex: sur [abes-hello-back](https://github.com/abes-esr/abes-hello-back/blob/develop/Dockerfile))
  - le `Dockerfile` de l'application execute également les tests de l'application ce qui permet d'éviter de produire une image docker embarquant un code qui ne fonctionne pas (exemple de paramétrage maven sur [abes-hello-back](https://github.com/abes-esr/abes-hello-back/blob/develop/Dockerfile#L27))
  - ce dépôt contient une github action souvent nommée `build-test-pubtodockerhub.yml` (ex: sur [abes-hello-front](https://github.com/abes-esr/abes-hello-front/blob/develop/.github/workflows/build-test-pubtodockerhub.yml)) permettant de construire l'image Docker et de la publier sur l'[espace abesesr sur dockerhub](https://hub.docker.com/orgs/abesesr).
  - ce dépôt contient une github action souvent nommée `create-release.yml` (ex: sur [abes-hello-front](https://github.com/abes-esr/abes-hello-front/blob/develop/.github/workflows/create-release.yml)) permettant de créer une nouvelle version/release de l'application
- l'application peut avoir besoin de plusieurs images docker, par exemple pour le front en vuejs (ex: [abes-hello-front](https://github.com/abes-esr/abes-hello-front/blob/develop/.github/workflows/build-test-pubtodockerhub.yml)), ou pour l'API en java Spring (ex: [abes-hello-back](https://github.com/abes-esr/abes-hello-front/blob/develop/.github/workflows/build-test-pubtodockerhub.yml))
- l'application possède un dépôt dédiée à son déploiement avec `docker-compose`, cf section suivante.

## Nommage des images docker

Pour nommer les images docker (elles sont publiées sur [DockerHub abesesr](https://hub.docker.com/u/abesesr)), nous privilégions cette nommenclature :
- `<organisationdocker>/<nomapplication>:<nom-branche|numero-version>-<module-applicatif>`
- exemple pour l'image docker du front de l'application `abes-hello` sur sa branche `develop` : `abesesr/abes-hello:develop-front`
- exemple pour l'image docker des batchs de l'application `abes-hello` sur sa branche `develop` : `abesesr/abes-hello:develop-batch`
- exemple pour l'image docker du front de l'application `abes-hello` sur sa branche `main` : `abesesr/abes-hello:main-front`
- exemple pour l'image docker du front de l'application `abes-hello` sur sa release `1.0.0` : `abesesr/abes-hello:1.0.0-front`


## Déploiement d'une application docker

Un dépôt github dédié au déploiement doit être créé pour l'application. La règle de nommage de ce dépôt est de commencer par le nom de l'application et de terminer par le suffix `-docker` (ex: [abes-hello-docker](https://github.com/abes-esr/abes-hello-docker)). Il permet à n'importe qui sur le web de venir tester l'application sur son environnement local ou sur son serveur. Ce dépôt permet de faciliter la réutilisation et les contributions externes.

Les éléments obligatoires de ce dépôt sont :
- le fichier `docker-compose.yml` : c'est la liste de tous les conteneurs et leurs configurations/articulations utilisés par l'application. Des règles doivent être respectées, cf paragraphe plus bas.
- le fichier `.env-dist` : c'est un fichier contenant les paramètres de l'application avec des exemples de valeurs. Il est destiné à être copié vers un fichier `.env` au moment de l'installation initiale de l'application et à personnaliser son contenu (ex: mot de passe d'une base de données, chaine de connexion etc ...)
- le fichier `README.md` : c'est la fiche d'exploitation de l'application qui explique comment installer, démarrer, stopper, superviser et sauvegarder l'application (ex: sur [abes-hello-docker](https://github.com/abes-esr/abes-hello-docker#readme)).

Le fichier docker-compose.yml de l'application décrit tous les conteneurs de l'application et leurs articulations, il doit respecter les règles suivantes :
- chaque nom de service doit être préfixé par le nom (court) de l'application, ex avec le préfix `abes-hello` ceci afin de mieux les distinguer et le regrouper au niveau d'un serveur hébergeant plusieurs applications différentes :
  ```
  services:
    abes-hello-front:
  ```
- chaque service doit nommer son conteneur en réutilisant le même nommage que le service, ex sur `abes-hello` :
  ```
  container_name: abes-hello-front
  ```
- chaque service (sauf rares exceptions) doit se configurer pour redémarrer automatiquement au démarrage de la machine, sauf si l'humain a stoppé intentionnellement le conteneur, cf la directive suivante :
  ```
  restart: unless-stopped
  ```
- chaque service doit limiter sa consommation mémoire et cpu à 5Go et 5 cpu max (sauf rares exceptions) et désactiver la mémoire swap, cf la directive suivante :  
  Dans docker-compose.yml :
  ```
  mem_limit: ${MEM_LIMIT}
  memswap_limit: ${MEM_LIMIT}
  cpus: ${CPU_LIMIT}
  ```  
  Avec dans .env-dist :
  ```
  ######################################################
  # Memory caping for containers : 5Go
  # CPU caping for containers : 5 CPU
  MEM_LIMIT=5g
  CPU_LIMIT=5
  ```


## Configuration d'une application avec docker

Une application qui est déployée en dev, test ou prod sera configurée différement. Des variables permettant de faire varier cette configuration doivent donc être prévues.

Pour chaque application, nous préconisons l'utilisation de variables d'environnement qui utilisent le système du fichier `.env` que docker interprétera. Ce fichier contient les variables d'environnement nécessaires aux conteneurs de l'application. Ce fichier est personnalisé manuellement au moment du premier déploiement et dépend de l'environnement de déploiement : dev, test ou prod. Pour créer ce fichier il suffit de faire une copie du fichier `.env-dist` qui est dans le dépôt `<appli>-docker` de l'application. Ce fichier contient la liste des variables nécessaires aux conteneurs avec des exemples (voir un exemple sur [hello-abes](https://github.com/abes-esr/abes-hello-docker/blob/develop/.env-dist))

Les variables doivent respecter la nomenclature suivante : 
- être en majuscule et utiliser des `_` pour séparer les différentes parties
- commencer par le nom du conteneur
- continuer par un nom court expliquant ce que contient cette variable

Exemple (cf [git](https://github.com/abes-esr/abes-hello-docker/blob/05c1038233a5385a6a535685877e96fe931d9093/.env-dist#L65-L66)) : `ABESHELLO_DB_USER` pour le nom d'utilisateur d'une base de données, et `ABESHELLO_DB_PASSWORD` pour le mot de passe d'accès à cette meme base de données. 


## Choix des ports réseau des conteneurs

Les ports externes utilisés par l'application doivent être contiguës dans une plage de port définie au début du projet (par exemple en réservant 10 ports contiguës) en prenant soin que cette plage de ports n'empiète pas sur d'autres plages de ports utilisées par d'autres applications du SI de l'Abes (l'application interne https://devops.abes.fr/index_ports_containers/ (accès interne Abes) doit être utilisée pour identifier cette plage libre), et que cette plage de ports soit libre sur toutes les machines hébergeant les containers (diplotaxis1, 2, 3, etc.). Cette plage de ports doit être choisie à la suite de la dernière plage de port utilisée par la dernière application ajoutée au SI de l'Abes. Les ports utilisés par une application déployée en dev, test ou prod sont considérés comme occupés, indépendement de l'environnement (par exemple les ports d'une application déployée uniquement en dev sont considérés comme occupés, même si cette dernière n'est pas en prod). Le fichier ``.env-dist`` doit indiquer dans des variables ces ports choisis qui deviennent donc les ports par défaut de l'application mais qui si besoin peuvent être paramétrés du fait qu'il sont variabilisés et pas codés en dur dans le ``docker-compose.yml``.

## Belles URL d'une application & reverse proxy

Un reverse proxy applicatif embarqué dans le ``docker-compose.yml`` est préconisé dans le cas où l'application nécessite une URL pour y accéder. Il est préconisé de baser le reverse proxy applicatif sur une base d'image nginx (serveur web léger et particulièrement adapté pour les reverse proxy). Le nomage du conteneur embarquant le reverse proxy application doit se terminer par "-rp" : ``<appli>-rp``

La mise en place d'une "belle URL" en HTTPS est préconisée pour les applications nécéssitant un accès via le web qu'il soit interne ou public. La "belle URL" est constituée d'un sous-domaine raccrochée à un domaine principal (exemple : https://item.sudoc.fr). Cette "belle URL" est paramétrée au niveau du reverse proxy d'entreprise (raiponce : le même pour toute l'Abes), et il est préconisé de faire pointer cette l'URL vers l'URL interne du reverse proxy applicatif quand il existe (ce qui permet d'avoir un seul mapping) ou, à défaut, vers les différentes URL internes de l'application si cette dernière n'a pas encore de reverse proxy applicatif (cf section "choix des ports réseau des conteneurs").

## Accès au système de fichier par les conteneurs

A rédiger : parler aussi ici des applications qui ont besoin accéder à un disque réseau via un montage NFS, nous privilégions de configurer un volume avec un NFS paramétrable (exemple : ezstats)

## Configuration de logs des conteneurs

Chaque application qui est "dockerisée" et qui produit des logs (c'est-à-dire toutes les applis ?), doit les produire de la même façon et indiquer au démon filebeat comment les récupérer pour qu'il puisse ensuite les envoyer correctement au puits de log (logstash / elasticsearch / kibana).

L'application doit respecter quelques règles :

1) produire ses logs à surveiller sur stdout et stderr
2) paramétrer filebeat avec des labels docker
3) produire ses logs personnalisés en respectant un format

### Logs docker via stderr et stdout

Pour que le conteneur de l'application produise ses logs sur stdout et stderr, il y a plusieurs possibilités.
- Si c'est une application Java le mieux est d'exécuter le process java en premier plan (foreground). Exemple de point d'entrée docker exécutant l'appli java à partir d'un JAR en premier plan : `ENTRYPOINT ["java","-jar","/app.jar"]`
- Si c'est une script shell (exemple un batch), alors on logguer sur stdout ou stderr au choix en utilisant `>/dev/stdout` (par défaut si rien n'est précisé c'est sur stdout que ça va) ou `>/dev/stderr` pour logguer les erreurs. Exemple :
  ```bash
  echo "INFO: ma ligne de log pour aller sur stdout" >/dev/stdout
  echo "ERROR: ma ligne de log pour aller sur stderr" >/dev/stderr
  ```
- Si c'est une application tierce qu'on ne peut donc pas trop modifier et qui loggue déjà dans un fichier, alors on peut soit configurer l'application pour lui demander de logguer les erreurs sur le fichier `/proc/self/fd/2` (c'est la même chose que le fichier `/dev/stderr`) sur le fichier `/proc/self/fd/1` (ou au choix `/dev/stdout`), soit identifier le chemin du fichier vers lequel l'application va logguer et s'en sortir avec un système de lien symbolique comme par exemple ce que l'image docker officielle de nginx fait : cf son [Dockerfile](https://github.com/nginxinc/docker-nginx/blob/8921999083def7ba43a06fabd5f80e4406651353/mainline/jessie/Dockerfile#L21-L23).

### Paramètrage pour verser les logs docker dans le puits de log (via filebeat)

Le paramétrage de la remontée des logs dans filebeat (permet le dépot des logs dans le puits de logs de l'Abes) se fait au niveau de chaque conteneur en suivant une nomenclature de "labels docker" (cf [recommandations](https://www.elastic.co/guide/en/beats/filebeat/current/running-on-docker.html#_customize_your_configuration)).

La configuration la plus simple est de seulement signaler à filebeat que les logs du conteneur sont à prendre en compte en n'indiquant aucun format de log. Pour cela il est nécessaire d'ajouter les labels suivant au conteneur. Voici un extrait à copier coller dans un `docker-compose.yml` qui montre comment signaler à filebeat de prendre les logs en compte :
```
    labels:
      - "co.elastic.logs/enabled=true"
      - "co.elastic.logs/processors.add_fields.target="
      - "co.elastic.logs/processors.add_fields.fields.abes_appli=monapplication"
      - "co.elastic.logs/processors.add_fields.fields.abes_middleware=httpd"
```

Les labels ont la signification suivante :
- `co.elastic.logs/enabled=true` : signifie qu'on souhaite que filebeat remonte les logs de ce conteneur (par défault c'est `false`)
- `co.elastic.logs/processors.add_fields.target=` : signifie qu'on souhaite ajouter les deux champs `abes_appli` et `abes_middleware` dans le puits de logs en rateau à la racine des champs (cf [la doc](https://www.elastic.co/guide/en/beats/filebeat/current/add-fields.html#add-fields))
- `co.elastic.logs/processors.add_fields.fields.abes_appli=monapplication` : signifie qu'on souhaite faire remonter un champs personnalisé nommé "abes_appli" qui contiendra comme valeur "monapplication" pour le conteneur présent. Ce champ "abes_appli" est obligatoire, il doit contenir le nom de l'application qui peut elle-même être éclatée en plusieurs conteneurs pour chaque middleware (un pour le web, un pour le back, un pour les batch etc ...), c'est ce champ qui permet de regrouper tous les conteneurs d'une même application au niveau du puits de logs. Remarque : le puits de logs n'accepte pas que le nom de l'application se termine par un chiffre (ex: si l'appli s'appelle "projet2024" ça ne convient pas, il faut que le nom se termine par une lettre, dans notre exemple ça pourrait donner "projetetab"). Remarque : dans une architecture de type orchestrateur (ex: OKD), c'est probablement le nom du pod qui remplacera la valeur de "abes_appli".
- `co.elastic.logs/processors.add_fields.fields.abes_middleware=Httpd` : le champs "abes_middleware" est obligatoire, il permet d'indiquer au puits de logs de l'Abes (via logstash précisément) la nature des logs envoyés et donc dans quel index elasticsearch doit-il classer ces logs. Les valeurs possibles sont : "adhoc", "Httpd" (mettre "adhoc" si ce sont des logs dont le format est spécifique à l'application).

Pour un exemple complet qui montre aussi comment spécifier un format de log précis, on peut se référer à [https://github.com/abes-esr/abes-filebeat-docker/blob/f4b19dfdccab690801c550c61724bd09cbeb6f5b/docker-compose.yml#L24-L37](https://github.com/abes-esr/abes-filebeat-docker/blob/f4b19dfdccab690801c550c61724bd09cbeb6f5b/docker-compose.yml#L24-L37)

On trouve alors d'autres labels dont voici la signification :
- `co.elastic.logs/module=nginx` : signifie qu'on dit à filebeat que ce conteneur produit des logs au format nginx ce qui lui permettra de les envoyer découpés dans le puits de logs (cf la liste des [modules filebeat disponibles](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-modules.html))
- `co.elastic.logs/fileset.stdout=access` : signifie que filebeat doit surveiller les logs stdout du conteneur
- `co.elastic.logs/fileset.stderr=error` : signifie que filebeat doit surveiller les logs stderr du conteneur

La dernière étape pour que les logs remontent jusqu'au puits de logs de l'Abes est de solliciter l'équipe puits de log de l'Abes pour lui demander d'intégrer (configuration à faire au niveau de la brique logstash) les logs de l'application en s'appuyant sur clé `co.elastic.logs/processors.add_fields.fields.abes_appli=monapplication`




